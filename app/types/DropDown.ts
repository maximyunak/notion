export interface DropDownItem {
    label: string;
    onSelect: () => void;
    color?: 'error' | 'success' | 'warning' | 'danger' | 'default';
    icon?: string;
}