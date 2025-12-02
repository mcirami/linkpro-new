import CreatePageForm from './Components/CreatePageForm';
import React, {useState} from 'react';
import {Head} from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { RiPagesLine } from "react-icons/ri";
/*import SocialMediaForms from './Components/SocialMediaForms';
import Facebook from './Components/Facebook';
import Instagram from './Components/Instagram';
import Twitter from './Components/Twitter';
import TikTok from './Components/TikTok';*/

function CreatePage({pageNames}) {

    //const [newPageId, setNewPageId] = useState("");
    //const [step, setStep] = useState("name");

    return (
        <AuthenticatedLayout>
            <Head title="Create Page" />
            <div className="container">
                <div className="px-6 pt-6">
                    <div className="flex items-center">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Choose Your Link Name</h1>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Add your first LinkPro Page</p>
                    <div className="mt-3 border-b border-gray-100"></div>
                </div>
                <section className="mx-auto flex flex-col items-center max-w-4xl mt-5 md:mt-10 min-h-lvh">
                    <div className="rounded-2xl bg-white shadow-md w-full">
                        <div className="flex items-start flex-wrap md:flex-nowrap gap-3 border-b border-gray-100 px-6 py-5 sm:items-center">
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200">
                                <RiPagesLine className="h-6 w-6" aria-hidden="true"/>
                            </span>
                            <div className="min-w-0 w-full md:w-auto" aria-hidden="true">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Get started by choosing your page name.
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Your name needs to be unique and can only contain letters, numbers, underscores and dashes.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-start p-10 pt-0">
                            <CreatePageForm
                                pageNames={pageNames}
                            />
                        </div>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    )
}

export default CreatePage;
