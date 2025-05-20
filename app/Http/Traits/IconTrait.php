<?php


namespace App\Http\Traits;


use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

trait IconTrait {

    /**
     * @return string[]
     */
    public function iconArray(): array {

        return array(
            "Airbnb",
            "Amazon Music",
            "Among Us",
            "Apple Music",
            "AutoTrader",
            "Behance",
            "Big Cartel",
            "CarGurus",
            "Cars",
            "CashApp",
            "Craigslist",
            "Depop",
            "Discord",
            "DoorDash",
            "Dropbox",
            "Ebay",
            "EbayMotors",
            "Email",
            "Etsy",
            "Facebook",
            "Facetime",
            "Fiverr",
            "Flickr",
            "Google Mail",
            "Google Drive",
            "Google Earth",
            "Google Photos",
            "GoogleChat",
            "GoogleMaps",
            "GrubHub",
            "ICQ",
            "InstaCart",
            "Instagram",
            "Life360",
            "LinkedIn",
            "Mailchimp",
            "Marketplace",
            "Medium",
            "Messenger",
            "MicrosoftTeams",
            "OfferUp",
            "OneDrive",
            "OpenTable",
            "Outlook",
            "Pandora",
            "Patreon",
            "Paypal",
            "PhotoBucket",
            "Picasa",
            "Pinterest",
            "Poshmark",
            "Postmates",
            "Quora",
            "Reddit",
            "Roblox",
            "Shopify",
            "Skype",
            "Slack",
            "Snapchat",
            "Soundcloud",
            "Spotify",
            "Telegram",
            "TikTok",
            "TripAdvisor",
            "Tumblr",
            "Twitch",
            "UberEats",
            "UpWork",
            "Venmo",
            "Viber",
            "Vimeo",
            "Whatsapp",
            "Wikipedia",
            "X",
            "Xbox",
            "Yahoo",
            "Yelp",
            "YouTube",
            "Zelle",
            "Zillow",
        );
    }

    /**
     * @param $iconPath
     * @param $savePath
     *
     * @return string
     */
    public function saveCustomImage($iconPath, $savePath): string {

        /*$userID = Auth::id();
        $imgName = $userID . '-' . time() . '.' . $request->ext;
        $path = 'custom-icons/' . $userID . '/' . $imgName;*/

        Storage::disk('s3')->delete($savePath);
        Storage::disk('s3')->copy(
            $iconPath,
            str_replace($iconPath, $savePath, $iconPath)
        );

        return  Storage::disk('s3')->url($savePath);
    }
}
