import React from 'react';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
const bannerAdUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-4297709039070563/4762080859';

export default function MyBannerAd() {
  return (
    <BannerAd
      unitId={bannerAdUnitId} // replace with real ID in production
      size={BannerAdSize.FULL_BANNER}
      requestOptions={{ requestNonPersonalizedAdsOnly: true }}
    />
  );
}