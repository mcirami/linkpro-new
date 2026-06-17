/**
 * One-off migration: convert legacy draft.js content to TipTap JSON.
 *
 * Background
 * ----------
 * Rich text used to be stored as draft.js rawContentState
 * ({ "blocks": [...], "entityMap": {...} }). The editor is now TipTap and new
 * content is stored as a TipTap doc ({ "type": "doc", ... }). The rich-text
 * columns (links.description, courses.intro_text, course_sections.text,
 * landing_page_sections.text) are MySQL `json` columns, so the stored value
 * must be valid JSON — we therefore convert legacy rows to a TipTap doc, the
 * same shape new content already uses, rather than to a raw HTML string.
 *
 * Conversion path (lossless relative to what users see today):
 *   draft raw  --draftToHtml-->  HTML  --generateJSON-->  TipTap doc
 * draftToHtml is the exact converter the app renders with today, and the
 * TipTap extension set matches convertText()/the editor, so the doc renders
 * identically via generateHTML().
 *
 * Idempotent: only rows whose value still has a draft `"blocks"` key are
 * touched. TipTap-doc and any other rows are left alone, so it is safe to
 * re-run.
 *
 * Usage
 * -----
 *   # dry run (default) — prints what WOULD change, writes nothing:
 *   node --env-file=.env scripts/migrate-draft-to-html.mjs
 *
 *   # apply (TAKE A DB BACKUP FIRST; run on staging before production):
 *   node --env-file=.env scripts/migrate-draft-to-html.mjs --commit
 *
 * Credentials come from the standard Laravel env vars (DB_HOST, DB_PORT,
 * DB_DATABASE, DB_USERNAME, DB_PASSWORD).
 */

import mysql from 'mysql2/promise';
import draftToHtml from 'draftjs-to-html';
import { generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';

const COMMIT = process.argv.includes('--commit');

// (table, column) pairs that hold rich text. If a prod scan turns up another
// column with draft content, add it here:
//   SELECT id FROM <table> WHERE <col> LIKE '%"blocks"%'
const TARGETS = [
    { table: 'links', column: 'description' },
    { table: 'courses', column: 'intro_text' },
    { table: 'course_sections', column: 'text' },
    { table: 'landing_page_sections', column: 'text' },
];

// Must match convertText()/the TipTap editor so converted docs render identically.
const EXTENSIONS = [
    StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5] },
        bulletList: { keepAttributes: true },
    }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Color,
    Underline,
    TextStyle,
];

const preview = (s, n = 90) => String(s).replace(/\s+/g, ' ').slice(0, n);

/**
 * Normalize a column value (mysql2 returns `json` columns already parsed as
 * objects, but a value could also arrive as a JSON string) and return the
 * draft rawContentState object, or null if it isn't draft content.
 */
function asDraftObject(value) {
    let parsed = value;

    if (typeof value === 'string') {
        try {
            parsed = JSON.parse(value);
        } catch {
            return null; // not JSON -> already HTML/plain, leave alone
        }
    }

    if (!parsed || typeof parsed !== 'object' || !Object.prototype.hasOwnProperty.call(parsed, 'blocks')) {
        return null; // TipTap doc or some other shape -> leave alone
    }

    return parsed;
}

/**
 * draft raw object -> TipTap doc object.
 */
function draftToTiptapDoc(draft) {
    // Mirror convertText(): every block must have a `text` field.
    draft.blocks = (draft.blocks || []).map((block) => ({
        ...block,
        text: block.text ?? '',
    }));

    const html = draftToHtml(draft);
    return generateJSON(html, EXTENSIONS);
}

async function main() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });

    console.log(`Connected to "${process.env.DB_DATABASE}" — mode: ${COMMIT ? 'COMMIT (writing)' : 'DRY RUN (no writes)'}\n`);

    let converted = 0;
    let skipped = 0;
    let failed = 0;

    for (const { table, column } of TARGETS) {
        const [rows] = await connection.query(
            `SELECT id, \`${column}\` AS content FROM \`${table}\` WHERE \`${column}\` LIKE '%"blocks"%'`
        );
        console.log(`${table}.${column}: ${rows.length} candidate row(s)`);

        for (const row of rows) {
            const draft = asDraftObject(row.content);
            if (draft === null) {
                skipped++; // matched the LIKE but isn't actually draft content
                continue;
            }

            let doc;
            try {
                doc = draftToTiptapDoc(draft);
            } catch (e) {
                failed++;
                console.error(`  #${row.id} conversion error: ${e.message}`);
                continue;
            }

            const json = JSON.stringify(doc);

            if (COMMIT) {
                await connection.execute(
                    `UPDATE \`${table}\` SET \`${column}\` = ? WHERE id = ?`,
                    [json, row.id]
                );
                console.log(`  #${row.id} converted -> TipTap doc (${json.length} chars)`);
            } else {
                const before = typeof row.content === 'string' ? row.content : JSON.stringify(row.content);
                console.log(`  #${row.id}`);
                console.log(`      before (draft) : ${preview(before)}`);
                console.log(`      after  (tiptap): ${preview(json)}`);
            }
            converted++;
        }
    }

    console.log(
        `\n${COMMIT ? 'Converted' : 'Would convert'}: ${converted}  |  skipped (not draft): ${skipped}  |  errors: ${failed}`
    );
    if (!COMMIT && converted > 0) {
        console.log('Re-run with --commit to apply (after a DB backup).');
    }

    await connection.end();
}

main().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
