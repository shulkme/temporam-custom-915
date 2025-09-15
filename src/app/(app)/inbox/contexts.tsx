'use client';
import { getAllDomains } from '@/api/domain';
import { DomainRecord } from '@/api/domain/types';
import { useLocalStorageState, useRequest } from 'ahooks';
import { debounce, draw, random, uid } from 'radash';
import React, { createContext, useContext, useState } from 'react';

interface EmailRecord {
  full_address: string;
  domain: DomainRecord;
  name: string;
}

const InboxContext = createContext<{
  domains: DomainRecord[];
  loading: boolean;
  currentEmail?: EmailRecord;
  setCurrentEmail: (newEmail: EmailRecord) => void;
  onRandom: (suffix?: string) => void;
  randomEmail: (
    domains: DomainRecord[],
    suffix?: string,
  ) => EmailRecord | undefined;
} | null>(null);

const InboxProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [domains, setDomains] = useState<DomainRecord[]>([]);
  const [currentEmail, setCurrentEmail] = useState<EmailRecord>();

  const [historyEmail, setHistoryEmail] = useLocalStorageState<
    EmailRecord | undefined
  >('config', {
    // listenStorageChange: true,
  });

  const randomEmail = (domains: DomainRecord[], suffix?: string) => {
    const domain = suffix
      ? domains.find((f) => f.domain === suffix)
      : draw(domains);

    if (domain) {
      const name = uid(random(3, 7)).toLowerCase();
      const full_address = [name, domain.domain].join('@');
      return {
        name,
        full_address,
        domain,
      };
    }
  };

  const { loading } = useRequest(getAllDomains, {
    onSuccess: (res) => {
      const list = res.data.map((f) => ({
        ...f,
        id: f.id.toString(),
      }));
      setDomains(list);
      if (historyEmail) {
        setCurrentEmail(historyEmail);
      } else {
        const email = randomEmail(list);
        if (email) {
          setCurrentEmail(email);
          setHistoryEmail(email);
        }
      }
    },
  });

  const onRandom = debounce(
    {
      delay: 300,
    },
    (suffix?: string) => {
      const email = randomEmail(domains, suffix);
      if (email) {
        setCurrentEmail(email);
        setHistoryEmail(email);
      }
    },
  );

  return (
    <InboxContext.Provider
      value={{
        loading,
        domains,
        currentEmail,
        onRandom,
        setCurrentEmail,
        randomEmail,
      }}
    >
      {children}
    </InboxContext.Provider>
  );
};

const useInbox = () => {
  const context = useContext(InboxContext);
  if (!context) {
    throw new Error('useInbox must be used within the context');
  }
  return context;
};

export { InboxProvider, useInbox };
