export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: '대시보드', icon: 'LayoutDashboard' },
  { id: 'users', label: '유저 분석', icon: 'Users' },
  { id: 'campaigns', label: '캠페인', icon: 'Megaphone' },
  { id: 'monitor', label: '시스템 모니터', icon: 'Monitor' },
];

export const TOP_NAV_TABS = [
  { id: 'realtime', label: '실시간 데이터' },
  { id: 'past', label: '과거 지표' },
  { id: 'alerts', label: '알림' },
];
