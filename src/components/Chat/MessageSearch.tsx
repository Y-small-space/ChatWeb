import React from "react";
import { Input, Dropdown, List, Avatar, Empty } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import type { Message } from "../../services/api";

interface MessageSearchProps {
  messages: Message[];
  onSelect: (messageId: string) => void;
}

export const MessageSearch: React.FC<MessageSearchProps> = ({
  messages,
  onSelect,
}) => {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const [searchText, setSearchText] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const filteredMessages = React.useMemo(() => {
    if (!searchText) return [];
    return messages.filter(
      (msg) =>
        msg.type === "text" &&
        msg.content.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [messages, searchText]);

  const content = (
    <div style={{ width: 300 }}>
      {filteredMessages.length > 0 ? (
        <List
          dataSource={filteredMessages}
          renderItem={(msg) => (
            <List.Item
              style={{ cursor: "pointer", padding: "8px 12px" }}
              onClick={() => {
                onSelect(msg.id);
                setOpen(false);
                setSearchText("");
              }}
            >
              <List.Item.Meta
                avatar={<Avatar src={msg.sender?.avatar} size="small" />}
                title={msg.sender?.nickname}
                description={
                  <div style={{ color: currentTheme.colors.secondaryText }}>
                    {msg.content.length > 50
                      ? msg.content.slice(0, 50) + "..."
                      : msg.content}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : searchText ? (
        <Empty
          description={t("chat.noSearchResults")}
          style={{ padding: "24px" }}
        />
      ) : null}
    </div>
  );

  return (
    <Dropdown
      open={open && !!searchText}
      onOpenChange={setOpen}
      trigger={["click"]}
      dropdownRender={() => content}
    >
      <Input
        prefix={<SearchOutlined />}
        placeholder={t("chat.searchMessages")}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 200 }}
        allowClear
      />
    </Dropdown>
  );
};
