'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChatWindowGroup } from 'src/components/Chat/ChatWindowGroup';
import { api } from 'src/services/api';

export default function ChatPage() {
  const { id } = useParams();
  const [groupInfo, setGroupInfo] = useState();

  const getGroupInfo = async () => {
    const res = await api.groups.getGroupDetails(id);
    setGroupInfo(res.group);
  };

  useEffect(() => {
    getGroupInfo();
  }, []);

  return (
    groupInfo && <ChatWindowGroup id={id} GroupInfo={groupInfo} />
  );
}
