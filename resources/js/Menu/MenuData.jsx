import {
    RiBarChart2Line,
    RiMailLine,
    RiPagesLine,
    RiUserSettingsLine,
} from 'react-icons/ri';
import {MdOutlineDashboard, MdOutlineSchool} from 'react-icons/md';

const MenuData = [
    {
        id: 'pages',
        name: 'pages',
        pageUrl: '/dashboard/pages/',
        icon: <RiPagesLine/>,
        permission: 'view dashboard'
    },
    {
        id: 'creator_center_link',
        name: 'creator center',
        pageUrl: '/creator-center',
        icon: <MdOutlineDashboard />,
        permission: 'view creator center'
    },
    {
        id: 'stats',
        name: 'stats',
        pageUrl: '/stats',
        icon: <RiBarChart2Line/>,
        permission: 'view stats'
    },
    {
        id: 'courses',
        name: 'courses',
        pageUrl: '/courses',
        icon: <MdOutlineSchool/>,
        permission: 'view courses'
    },
    {
        id: 'pre_register',
        name: 'pages',
        pageUrl: '/pre-register-link-pro',
        icon: <RiPagesLine/>,
        permission: 'view courses'
    },
    {
        id: 'settings',
        name: 'settings',
        pageUrl: '/edit-account',
        icon: <RiUserSettingsLine />,
        permission: 'has permission'
    },
    {
        id: 'contact_us',
        name: 'contact us',
        pageUrl: '/contact',
        icon: <RiMailLine/>,
        permission: 'all'
    },

]

export default MenuData;
