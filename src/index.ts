import "./style.css";

// UI
export { default as Button } from "./components/ui/button/Button";
export { PrimaryButton, SecondaryButton, IconButton, LightIconButton, SoftIconButton } from "./components/ui/button/Button.presets";
export { default as Icon } from "./components/ui/icon/Icon";
export type { IconName } from "./components/ui/icon/Icon";
export { default as Input } from "./components/ui/input/Input";
export { DefaultInput, SearchInput, PasswordInput } from "./components/ui/input/Input.presets";
export { default as Hyperlink } from "./components/ui/link/Hyperlink";
export { HyperlinkUrlType } from "./components/ui/link/Hyperlink.enum";
export { default as Select } from "./components/ui/select/Select";
export type { SelectOption } from "./components/ui/select/Select";
export { DefaultSelect, BooleanSelect } from "./components/ui/select/Select.presets";
export { default as Switcher } from "./components/ui/switcher/Switcher";
export { default as Textarea } from "./components/ui/textarea/Textarea";
export { DefaultTextarea, CharCountTextarea } from "./components/ui/textarea/Textarea.presets";

// Feedback
// Alert e Tooltip ainda são arquivos vazios no web-app (não implementados) —
// migrados como estão, sem export no barrel até terem conteúdo real.
export { default as Skeleton } from "./components/feedback/skeleton/Skeleton";
export type { SkeletonProps } from "./components/feedback/skeleton/Skeleton.d";
export { ImageSkeleton } from "./components/feedback/skeleton/Skeleton.presets";

// Overlay
export { MenuList, MenuItem } from "./components/overlay/Menu";
export { ContextMenu } from "./components/overlay/contextMenu/ContextMenu";
export type { ContextMenuHandle, ContextMenuItem } from "./components/overlay/contextMenu/ContextMenu";
export { ContextMenuProvider } from "./components/overlay/contextMenu/provider/ContextMenuProvider";
export { useContextMenu } from "./components/overlay/contextMenu/useContextMenu";

// Brand
export { default as Copyright } from "./components/brand/copyright/Copyright";
export { default as Logo } from "./components/brand/logo/Logo";

// Layout
export { default as Footer } from "./components/layout/footer/Footer";
export { default as Sidebar, useSidebarCollapsed } from "./components/layout/sidebar/Sidebar";
export { SidebarOption } from "./components/layout/sidebar/Sidebar.reusables";
export { SaaSLayout } from "./components/layout/saas/SaaSLayout";
export { default as Access } from "./components/layout/access/Access";
export type { AccessField } from "./components/layout/access/Access";
export { default as EntityCard } from "./components/layout/announcement/entity-card/EntityCard";
export type { EntityCardItem } from "./components/layout/announcement/entity-card/EntityCard";
export { default as EntityCorridor } from "./components/layout/announcement/corridor/EntityCorridor";
export { default as Message } from "./components/layout/chat/message/Message";
export { default as ChatLayout } from "./components/layout/chat/chat-layout/ChatLayout";
export type { ChatMessage, ChatParticipant } from "./components/layout/chat/chat.d";
export { ProfileHead } from "./components/layout/profile/ProfileHead";
export { default as ProfilePage } from "./components/layout/profile/ProfilePage";
export { default as ProfilePageSkeleton } from "./components/layout/profile/ProfilePageSkeleton";
export { default as WrapperLayout } from "./config/WrapperLayout";

// Shared
export { default as Colors } from "./shared/styles/colors/colors.enum";
export type { RedirectOption } from "./shared/types/navigation/navigation";
