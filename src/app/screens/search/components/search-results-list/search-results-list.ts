import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  formatUserFullName,
  formatUserInitials,
  getUserAvatarTone,
} from '@core/mocks/workspace.mock';
import { MemberUser, SearchResultsView } from '@core/models/workspace.models';
import { RoleStateService } from '@core/state/role-state.service';
import { UiAvatarComponent, UiFileIconComponent } from '@ui';

@Component({
  selector: 'app-search-results-list',
  imports: [RouterLink, UiFileIconComponent, UiAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  templateUrl: './search-results-list.html',
})
export class SearchResultsListComponent {
  protected readonly roleState = inject(RoleStateService);

  readonly results = input.required<SearchResultsView>();

  protected getInitials(user: MemberUser) {
    return formatUserInitials(user);
  }

  protected getTone(user: MemberUser) {
    return getUserAvatarTone(user);
  }

  protected getFullName(user: MemberUser) {
    return formatUserFullName(user);
  }
}
