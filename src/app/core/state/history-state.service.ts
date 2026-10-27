import { computed, inject, Injectable, signal } from '@angular/core';
import { UiIconName } from '@ui';
import { AuthApiService } from '../api/auth-api.service';
import { WorkspaceApiService } from '../api/workspace-api.service';
import {
  HistoryDayGroup,
  HistoryEventItem,
  HistoryEventKind,
  HistoryEventView,
  HistoryFilterKind,
} from '../models/workspace.models';

export interface HistoryFilterOption {
  readonly id: HistoryFilterKind;
  readonly label: string;
}

interface HistoryKindMeta {
  readonly icon: UiIconName;
  readonly toneClass: string;
  readonly filterCategory: Exclude<HistoryFilterKind, 'all'>;
}

const HISTORY_KIND_META: Record<HistoryEventKind, HistoryKindMeta> = {
  group: {
    icon: 'sparkles',
    toneClass: 'bg-pin/25 text-pin-foreground',
    filterCategory: 'members',
  },
  member_added: {
    icon: 'user-plus',
    toneClass: 'bg-emerald-100 text-emerald-700',
    filterCategory: 'members',
  },
  member_removed: {
    icon: 'user-minus',
    toneClass: 'bg-rose-100 text-rose-700',
    filterCategory: 'members',
  },
  file_added: {
    icon: 'file-plus-corner',
    toneClass: 'bg-blue-100 text-blue-700',
    filterCategory: 'files',
  },
  file_renamed: {
    icon: 'file-pen',
    toneClass: 'bg-sky-100 text-sky-700',
    filterCategory: 'files',
  },
  file_deleted: {
    icon: 'file-x-corner',
    toneClass: 'bg-rose-100 text-rose-700',
    filterCategory: 'files',
  },
  folder_created: {
    icon: 'folder-plus',
    toneClass: 'bg-accent text-primary',
    filterCategory: 'files',
  },
  role_changed: {
    icon: 'star',
    toneClass: 'bg-amber-100 text-amber-800',
    filterCategory: 'access',
  },
  upload_access: {
    icon: 'shield-check',
    toneClass: 'bg-violet-100 text-violet-700',
    filterCategory: 'access',
  },
};

export const HISTORY_FILTERS: readonly HistoryFilterOption[] = [
  { id: 'all', label: 'Усе' },
  { id: 'files', label: 'Файли й папки' },
  { id: 'members', label: 'Учасники' },
  { id: 'access', label: 'Ролі та доступ' },
];

@Injectable({ providedIn: 'root' })
export class HistoryStateService {
  private readonly workspaceApi = inject(WorkspaceApiService);
  private readonly authApi = inject(AuthApiService);

  private readonly eventsState = signal<HistoryEventItem[]>([]);
  private readonly activeFilterState = signal<HistoryFilterKind>('all');

  readonly filterOptions = HISTORY_FILTERS;
  readonly activeFilter = this.activeFilterState.asReadonly();

  readonly filteredEvents = computed<HistoryEventView[]>(() => {
    const filter = this.activeFilterState();
    return this.eventsState()
      .map((item) => {
        const meta = HISTORY_KIND_META[item.kind];
        return {
          ...item,
          icon: meta.icon,
          toneClass: meta.toneClass,
          filterCategory: meta.filterCategory,
        };
      })
      .filter((item) => filter === 'all' || item.filterCategory === filter);
  });

  readonly dayGroups = computed<HistoryDayGroup[]>(() => {
    const events = this.filteredEvents();
    const uniqueDays = Array.from(new Set(events.map((item) => item.day)));
    return uniqueDays.map((day) => ({
      day,
      events: events.filter((item) => item.day === day),
    }));
  });

  constructor() {
    void this.hydrateFromApi();
  }

  async hydrateFromApi(): Promise<void> {
    if (!this.authApi.hasToken()) {
      this.eventsState.set([]);
      return;
    }
    try {
      const events = await this.workspaceApi.fetchHistoryEvents();
      this.eventsState.set(events);
    } catch {
      this.eventsState.set([]);
    }
  }

  clear(): void {
    this.eventsState.set([]);
  }

  setFilter(filter: HistoryFilterKind): void {
    this.activeFilterState.set(filter);
  }
}
