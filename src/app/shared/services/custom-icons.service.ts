import { Injectable } from '@angular/core';

import { addIcons }   from 'ionicons';

@Injectable({
  providedIn: 'root',
})
export class CustomIconsService {
  constructor() {
    addIcons({
      'passaparola-double-check-success':
        'assets/images/custom-icons/passaparola-double-check-success.svg',
      'passaparola-wallet-icon':
        'assets/images/custom-icons/passaparola-wallet-icon.svg',
      'passaparola-icon': 'assets/images/custom-icons/passaparola-icon.svg',
      'passaparola-community':
        'assets/images/custom-icons/passaparola-community.svg',
      'passaparola-community-outline':
        'assets/images/custom-icons/passaparola-community-outline.svg',
      'passaparola-suggest':
        'assets/images/custom-icons/passaparola-suggest.svg',
      'passaparola-suggest2':
        'assets/images/custom-icons/passaparola-suggest2.svg',
      'passaparola-piggy': 'assets/images/custom-icons/passaparola-piggy.svg',
      'passaparola-piggy-outline':
        'assets/images/custom-icons/passaparola-piggy-outline.svg',
      'passaparola-wallet': 'assets/images/custom-icons/passaparola-wallet.svg',
      'passaparola-wallet-outline':
        'assets/images/custom-icons/passaparola-wallet-outline.svg',
      'passaparola-card': 'assets/images/custom-icons/passaparola-card.svg',
      'passaparola-museum': 'assets/images/custom-icons/passaparola-museum.svg',
      'passaparola-list-box':
        'assets/images/custom-icons/passaparola-list-box.svg',
      'passaparola-id-card':
        'assets/images/custom-icons/passaparola-id-card.svg',
      'passaparola-calendar-alt':
        'assets/images/custom-icons/passaparola-calendar-alt.svg',
      'passaparola-security':
        'assets/images/custom-icons/passaparola-security.svg',
      'passaparola-edit': 'assets/images/custom-icons/passaparola-edit.svg',
      'passaparola-logout': 'assets/images/custom-icons/passaparola-logout.svg',
      'passaparola-tags': 'assets/images/custom-icons/passaparola-tags.svg',
      'passaparola-mall': 'assets/images/custom-icons/passaparola-mall.svg',
      'passaparola-map': 'assets/images/custom-icons/passaparola-map.svg',
      'passaparola-professionals': 'assets/images/custom-icons/passaparola-professionals.svg',
      'passaparola-invia': 'assets/images/custom-icons/passaparola-invia.svg',
      'passaparola-ricevi': 'assets/images/custom-icons/passaparola-ricevi.svg',
      'passaparola-ritira': 'assets/images/custom-icons/passaparola-ritira.svg',
      'passaparola-movimenti':
        'assets/images/custom-icons/passaparola-movimenti.svg',
      'passaparola-icon-passaparola-wallet':
        'assets/images/custom-icons/passaparola-icon-passaparola-wallet.svg',
      'passaparola-icon-wallet-mov-payment':
        'assets/images/custom-icons/wallet-movements/payment.svg',
      'passaparola-icon-wallet-mov-reception':
        'assets/images/custom-icons/wallet-movements/reception.svg',
      'passaparola-icon-wallet-mov-refund':
        'assets/images/custom-icons/wallet-movements/refund.svg',
      'passaparola-icon-wallet-mov-send':
        'assets/images/custom-icons/wallet-movements/send.svg',
      'passaparola-icon-wallet-mov-commission':
        'assets/images/custom-icons/wallet-movements/send.svg',
      'passaparola-icon-wallet-mov-cashback':
        'assets/images/custom-icons/wallet-movements/refund.svg',
      'passaparola-user-plus':
        'assets/images/custom-icons/passaparola-user-plus.svg',
      'passaparola-camera': 'assets/images/custom-icons/passaparola-camera.svg',
      'passaparola-camera2':
        'assets/images/custom-icons/passaparola-camera2.svg',
      'passaparola-store': 'assets/images/custom-icons/passaparola-store.svg',
      'passaparola-compare-arrows':
        'assets/images/custom-icons/passaparola-compare-arrows.svg',
      'passaparola-location':
        'assets/images/custom-icons/passaparola-location.svg',
      'passaparola-go-store':
        'assets/images/custom-icons/passaparola-go-store.svg',
      'passaparola-money': 'assets/images/custom-icons/passaparola-money.svg',
      'passaparola-transfer-mobile':
        'assets/images/custom-icons/passaparola-transfer-mobile.svg',
      'passaparola-warning':
        'assets/images/custom-icons/passaparola-warning.svg',
      'passaparola-business':
        'assets/images/custom-icons/passaparola-business.svg',
      'passaparola-edit-circle':
        'assets/images/custom-icons/passaparola-edit-circle.svg',
      'passaparola-call': 'assets/images/custom-icons/passaparola-call.svg',
      'passaparola-list': 'assets/images/custom-icons/passaparola-list.svg',
      'passaparola-location2':
        'assets/images/custom-icons/passaparola-location2.svg',
      'passaparola-how-to-get-there':
        'assets/images/custom-icons/passaparola-how-to-get-there.svg',
      'passaparola-refresh':
        'assets/images/custom-icons/passaparola-refresh.svg',
      'passaparola-refresh-selected':
        'assets/images/custom-icons/passaparola-refresh-selected.svg',
      'passaparola-location-success':
        'assets/images/custom-icons/passaparola-location-success.svg',
      'passaparola-icono-shop':
        'assets/images/custom-icons/passaparola-icono-shop.svg',
      'passaparola-create-business':
        'assets/images/custom-icons/ico_business.svg',
      'passaparola-help-earn': 'assets/images/custom-icons/help-earn.svg',
      'passaparola-notifications-active':
        'assets/images/custom-icons/notifications-active.svg',
      'passaparola-ricevute-voucher':
        'assets/images/custom-icons/icon-ricevute-voucher.svg',
      'passaparola-arrows-filters':
        'assets/images/custom-icons/arrows-filters.svg',
      'passaparola-done-icon': 'assets/images/custom-icons/done-icon.svg',
      'passaparola-x-icon': 'assets/images/custom-icons/x.svg',
      'passaparola-voice-shared':
        'assets/events/custom-icons/icon-voice-shared.svg',
      'passaparola-icon-cart': 'assets/images/custom-icons/cart.svg',
      'passaparola-icon-clock-pink':
        'assets/images/custom-icons/feather-clock.svg',
      'passaparola-vote': 'assets/images/custom-icons/passaparola-vote.svg',
      'passaparola-pr': 'assets/images/custom-icons/punti-ricompensa.svg',
      'passaparola-cash-back': 'assets/images/custom-icons/cashback.svg',
      'passaparola-location-on': 'assets/images/custom-icons/location-on.svg',
      'passaparola-shopping-bag': 'assets/images/custom-icons/shopping-bag.svg',
      'passaparola-tab-tags': 'assets/images/custom-icons/tags.svg',
      'passaparola-user-tag': 'assets/images/custom-icons/user-tag.svg',
      'passaparola-star-yellow': 'assets/images/custom-icons/star-yellow.svg',
      'passaparola-bar-category': 'assets/images/custom-icons/bar-category.svg',
      'passaparola-to-go': 'assets/images/custom-icons/to-go.svg',
      'passaparola-profile-shopping':
        'assets/images/custom-icons/profile/profile-shopping.svg',
      'passaparola-profile-business':
        'assets/images/custom-icons/profile/profile-business.svg',
      'passaparola-profile-contact':
        'assets/images/custom-icons/profile/profile-contact.svg',
      'passaparola-profile-tags':
        'assets/images/custom-icons/profile/profile-tags.svg',
      'passaparola-profile-saved':
        'assets/images/custom-icons/profile/profile-saved.svg',
      'passaparola-profile-like':
        'assets/images/custom-icons/profile/profile-like.svg',
      'passaparola-profile-feed':
        'assets/images/custom-icons/profile/profile-feed.svg',
      'passaparola-profile-product':
        'assets/images/custom-icons/profile/profile-product.svg',
      'passaparola-profile-star':
        'assets/images/custom-icons/profile/profile-star.svg',
      'passaparola-tpv': 'assets/images/custom-icons/tpv.svg',
      'passaparola-recharges': 'assets/images/custom-icons/recharges.svg',
      'passaparola-paspot': 'assets/images/custom-icons/paspot.svg',
      'passaparola-profile-public':
        'assets/images/custom-icons/passaparola-profile-public.svg',

      'passaparola-post-like':
        'assets/images/custom-icons/post/post-like.svg',
      'passaparola-post-dislike':
        'assets/images/custom-icons/post/post-dislike.svg',

      'passaparola-post-save':
        'assets/images/custom-icons/post/post-save.svg',
      'passaparola-post-unsave':
        'assets/images/custom-icons/post/post-unsave.svg',

      'passaparola-profile-tag-requests':
        'assets/images/custom-icons/profile/profile-tag-requests.svg',

      'passaparola-profile-stats-tags':
        'assets/images/custom-icons/profile/profile-stats-tags.svg',

      'passaparola-preference':
        'assets/images/custom-icons/passaparola-preference.svg',

      'passaparola-post-investment': 'assets/images/custom-icons/post/post-investment.svg',
      'passaparola-post-event': 'assets/images/custom-icons/post/post-event.svg',
      'passaparola-post-go-store': 'assets/images/custom-icons/post/post-go-store.svg',
      'passaparola-post-tags': 'assets/images/custom-icons/post/post-tags.svg',
      'passaparola-post-video': 'assets/images/custom-icons/post/post-video.svg',
      'passaparola-lightning': 'assets/images/custom-icons/passaparola-lightning.svg',

      'check-success-wishbuy': 'assets/images/jointlybuy/check-success-wishbuy.svg',

      'cart-jointlybuy': 'assets/images/jointlybuy/cart-jointlybuy.svg',

      'passaparola-flame': 'assets/images/home-garden/flame.svg',
      'passaparola-lightbulb': 'assets/images/home-garden/lightbulb.svg',

      'passaparola-check-blue': 'assets/images/home-garden/check-blue.svg',
      'passaparola-headphone': 'assets/images/home-garden/headphone.svg',

      'address-trash': 'assets/images/address/address-trash.svg',
      'wallet-payment': 'assets/images/payments/wallet-payment.svg',

      'headset-contratto': 'assets/images/contratto/headset-contratto.svg',
      'user-check': 'assets/images/contratto/user-check.svg',

      'compare-arrows': 'assets/images/menu/compare-arrows.svg',
    });
  }
}
