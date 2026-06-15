<?php
namespace App\Http\Traits;

trait StatsTrait {

    public function sumTotals($totalsArray, $object, $userStats) {


        if ($userStats) {

            foreach($userStats as $stat) {

                array_key_exists( 'totalRaw', $totalsArray ) ?
                    $totalsArray['totalRaw'] += $stat['rawCount'] :
                    $totalsArray['totalRaw'] = $stat['rawCount'];

                array_key_exists( 'totalUnique', $totalsArray ) ?
                    $totalsArray['totalUnique'] += $stat['uniqueCount'] :
                    $totalsArray['totalUnique'] = $stat['uniqueCount'];

                array_key_exists( 'totalConversions', $totalsArray ) ?
                    $totalsArray['totalConversions'] += $stat['conversionCount'] :
                    $totalsArray['totalConversions'] = $stat['conversionCount'];

                array_key_exists( 'totalPayout', $totalsArray ) ?
                    number_format( $totalsArray['totalPayout'] += $stat['payout'], 2 ) :
                    $totalsArray['totalPayout'] = number_format( $stat['payout'], 2 );

            }

            return $totalsArray;

        } else {

            return [
                'totalRaw'         =>
                    array_key_exists( 'totalRaw', $totalsArray ) ?
                        $totalsArray['totalRaw'] += $object['rawCount'] :
                        $object['rawCount'],
                'totalUnique'      =>
                    array_key_exists( 'totalUnique', $totalsArray ) ?
                        $totalsArray['totalUnique'] += $object['uniqueCount'] :
                        $object['uniqueCount'],
                'totalConversions' =>
                    array_key_exists( 'totalConversions', $totalsArray ) ?
                        $totalsArray['totalConversions'] += $object['conversionCount'] :
                        $object['conversionCount'],
                'totalPayout'      =>
                    array_key_exists( 'totalPayout', $totalsArray ) ?
                        number_format( $totalsArray['totalPayout'] += $object['payout'], 2 ) :
                        number_format( $object['payout'], 2 )
            ];


        }
    }

    /**
     * Commission is calculated against the amount actually paid for each
     * purchase (purchase_amount), NOT the offer's current price. Using the
     * live price would retroactively change historical payouts whenever a
     * creator edits their offer price.
     *
     * @param $price  Retained for backwards compatibility; no longer used.
     */
    public function calculatePayout($clicks, $price = null, $userId = null) {

        $payout = 0.00;
        foreach ( $clicks as $click ) {

            if ($click->purchase_amount) {
                $rate = ( $click->referral_id == $userId ) ? .80 : .40;
                $payout += $click->purchase_amount * $rate;
            }
        }

        return number_format($payout, 2);
    }

    public function groupStatsByUser($clicks, $authUserID = null) {

        $groups = $clicks->mapToGroups(function ($item, $key) {
            return [
                $item['username'] => [
                    'unique'        => $item['is_unique'],
                    'conversion'    => $item['purchase_amount'],
                    'referralId'    => $item['referral_id'],
                    'userId'        => $item['user_id'] ?: null
                ]
            ];
        });

        $groupArray = $groups->toArray();
        $array = [];

        foreach($groups as $key => $value) {

            $uniqueCount = 0;
            $rawCount = 0;
            $conversionCount = 0;
            $conversionTotal = 0.00;

            foreach($groupArray[$key] as $innerValue){

                if($innerValue['unique'] == 0) {
                    ++$rawCount;
                }

                if($innerValue['unique'] == 1) {
                    ++$uniqueCount;
                }

                if($innerValue['conversion'] != null) {
                    ++$conversionCount;

                    if ( $innerValue["referralId"] == $authUserID || $innerValue["referralId"] == $innerValue["userId"]) {
                        $conversionTotal += ($innerValue["conversion"] * .80);
                    } else {
                        $conversionTotal += ($innerValue["conversion"] * .40);
                    }
                }
            }

            $object = [
                'name'              => $key,
                'rawCount'          => $rawCount,
                'uniqueCount'       => $uniqueCount,
                'conversionCount'   => $conversionCount,
                'payout'            => number_format($conversionTotal,2),
            ];

            array_push($array, $object);
        }

        return $array;
    }

    public function countConversions($array) {
        return count(array_filter($array, function ($var) {
            return $var['purchase_amount'] != null;
        }));
    }
}
