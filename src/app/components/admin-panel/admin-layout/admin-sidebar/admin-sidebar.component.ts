import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

// Extend the Window interface to include the feather and bootstrap properties
declare global {
  interface Window {
    feather?: { replace: () => void };
    bootstrap?: any;
  }
}

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css'],
  imports: [RouterLink, CommonModule]
})
export class AdminSidebarComponent implements AfterViewInit {
  isCoursesMenuOpen = false;
  isHelpdeskMenuOpen = false;
  isReportsMenuOpen = false;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    // Reinitialize Feather icons
    if (window.feather) {
      window.feather.replace();
    }

    // Reinitialize Bootstrap components
    this.reinitializeBootstrapComponents();

    this.setActiveMenuOnLoad();
  }

  setActiveMenuOnLoad(): void {
    // Check the current route and activate the corresponding menu
    if (this.router.url.includes('/admin/dashboard')) {
      this.closeAllMenus();
    } else if (this.router.url.includes('/admin/course') || this.router.url.includes('/admin/module')) {
      this.isCoursesMenuOpen = true;
    } else if (this.router.url.includes('/admin/helpdesk')) {
      this.isHelpdeskMenuOpen = true;
    } else if (this.router.url.includes('/admin/reports')) {
      this.isReportsMenuOpen = true;
    }
  }

  toggleMenu(menu: string): void {
    // Close all menus first
    this.closeAllMenus();

    // Open the clicked menu
    if (menu === 'courses') {
      this.isCoursesMenuOpen = true;
    } else if (menu === 'helpdesk') {
      this.isHelpdeskMenuOpen = true;
    } else if (menu === 'reports') {
      this.isReportsMenuOpen = true;
    }
  }

  activateSubmenu(parentMenu: string): void {
    // Expand the parent menu when a submenu is clicked
    this.closeAllMenus();
    if (parentMenu === 'courses') {
      this.isCoursesMenuOpen = true;
    } else if (parentMenu === 'helpdesk') {
      this.isHelpdeskMenuOpen = true;
    } else if (parentMenu === 'reports') {
      this.isReportsMenuOpen = true;
    }
  }

  closeAllMenus(): void {
    this.isCoursesMenuOpen = false;
    this.isHelpdeskMenuOpen = false;
    this.isReportsMenuOpen = false;
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  isSubmenuActive(routes: string[]): boolean {
    return routes.some(route => this.router.url.includes(route));
  }

  private reinitializeBootstrapComponents(): void {
    // Reinitialize dropdowns
    const dropdownTriggerList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdownTriggerList.forEach(dropdownTriggerEl => {
      new window.bootstrap.Dropdown(dropdownTriggerEl);
    });

    // Reinitialize collapses
    const collapseTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="collapse"]'));
    collapseTriggerList.forEach(collapseTriggerEl => {
      new window.bootstrap.Collapse(collapseTriggerEl, { toggle: false });
    });
  }
}
