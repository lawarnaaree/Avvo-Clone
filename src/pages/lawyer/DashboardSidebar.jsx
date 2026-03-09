import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiUser, FiMessageSquare, FiSettings, FiExternalLink, FiCalendar } from 'react-icons/fi';
import './DashboardSidebar.css';

const DashboardSidebar = () => {
    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-nav">
                <NavLink to="/dashboard/lawyer" end className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                    <FiGrid className="sidebar-icon" />
                    <span>Overview</span>
                </NavLink>
                <NavLink to="/dashboard/lawyer/profile" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                    <FiUser className="sidebar-icon" />
                    <span>Edit Profile</span>
                </NavLink>
                <NavLink to="/dashboard/lawyer/answers" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                    <FiMessageSquare className="sidebar-icon" />
                    <span>Manage Answers</span>
                </NavLink>
                <NavLink to="/dashboard/lawyer/messages" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                    <FiMessageSquare className="sidebar-icon" />
                    <span>Messages</span>
                </NavLink>
                <NavLink to="/dashboard/lawyer/bookings" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                    <FiCalendar className="sidebar-icon" />
                    <span>Manage Bookings</span>
                </NavLink>
                <NavLink to="/dashboard/lawyer/settings" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                    <FiSettings className="sidebar-icon" />
                    <span>Settings</span>
                </NavLink>
            </div>

            <div className="sidebar-footer">
                <a href="/find-lawyer-nepal/search" className="sidebar-link secondary">
                    <FiExternalLink className="sidebar-icon" />
                    <span>View Public Directory</span>
                </a>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
