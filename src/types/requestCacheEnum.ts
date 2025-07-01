enum TabbarEnum {
  GetTotalUnreadCount = 'GetTotalUnreadCount',
}

enum HooksPageEnum {
  GetMyHooksList = 'GetMyHooksList',
  GetTemplateHooksList = 'GetTemplateHooksList',
}

export enum RequestCacheEnum {
  GetTotalUnreadCount = TabbarEnum.GetTotalUnreadCount,
  GetMyHooksList = HooksPageEnum.GetMyHooksList,
  GetTemplateHooksList = HooksPageEnum.GetTemplateHooksList,
}
