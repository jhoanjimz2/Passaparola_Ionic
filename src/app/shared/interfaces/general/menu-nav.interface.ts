export interface MenuNav {
  title: string;
  children: Child[];
  visible: boolean;
}

interface Child {
  icon: string;
  name: string;
  redirectTo: string;
  navType: string;
  queryParams: any;
  action?: string;
  visible: boolean;
  isSeat?: boolean;
}
