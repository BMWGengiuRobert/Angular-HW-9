import { TablePreferences } from "../../models/table-preferences.model";
import { User } from "../../models/user.model";

export interface UserTableState {
    users: User[];
    loading: boolean;
    error: string | null;
    preferences: TablePreferences | null;
}

export const defaultTablePreferences: TablePreferences = {
    sort: { field: 'firstName', direction: 'asc' },
    pagination: { pageSize: 10, pageNumber: 1 },
    searchFilter: ''
};

export const initialUserTableState: UserTableState = {
    users: [],
    loading: false,
    error: null,
    preferences: defaultTablePreferences
};