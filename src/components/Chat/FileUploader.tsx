"use client";

import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { PictureOutlined, FileOutlined } from "@ant-design/icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";

interface FileUploaderProps {
  onUploadSuccess: (
    url: string,
    fileType: "image" | "file",
    fileInfo?: {
      name: string;
      size: number;
      type: string;
      url: string;
    }
  ) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadSuccess,
}) => {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const [uploading, setUploading] = useState(false);

  const handleUpload: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
  }) => {
    try {
      setUploading(true);
      // 这里模拟文件上传
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const isImage = file.type?.startsWith("image/");
      const url = isImage ? URL.createObjectURL(file as Blob) : "#"; // 实际项目中这里应该是上传后的文件URL

      if (isImage) {
        onUploadSuccess(url, "image");
      } else {
        onUploadSuccess(url, "file", {
          name: file.name,
          size: file.size || 0,
          type: file.type || "",
          url: url,
        });
      }

      onSuccess?.(url);
      message.success(t("chat.uploadSuccess"));
    } catch (error) {
      message.error(t("chat.uploadError"));
    } finally {
      setUploading(false);
    }
  };

  const beforeUpload = (file: UploadFile) => {
    const isLt10M = (file.size || 0) / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error(t("chat.fileSizeLimit"));
    }
    return isLt10M;
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Upload
        customRequest={handleUpload}
        showUploadList={false}
        beforeUpload={beforeUpload}
        accept="image/*"
      >
        <Button
          type="text"
          icon={<PictureOutlined />}
          loading={uploading}
          style={{ color: currentTheme.colors.text }}
        />
      </Upload>
      <Upload
        customRequest={handleUpload}
        showUploadList={false}
        beforeUpload={beforeUpload}
      >
        <Button
          type="text"
          icon={<FileOutlined />}
          loading={uploading}
          style={{ color: currentTheme.colors.text }}
        />
      </Upload>
    </div>
  );
};
