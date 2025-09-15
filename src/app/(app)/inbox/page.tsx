'use client';
import EmailPane from '@/app/(app)/inbox/components/email-pane';
import Messages from '@/app/(app)/inbox/components/messages';
import PreviewModal from '@/app/(app)/inbox/components/preview-modal';
import { InboxProvider } from '@/app/(app)/inbox/contexts';
import PageContainer from '@/app/components/page-container';

export default function Page() {
  return (
    <InboxProvider>
      <PageContainer size="medium" title="收信箱">
        <div className="space-y-4 md:space-y-5 lg:space-y-6">
          <EmailPane />
          <Messages />
        </div>
      </PageContainer>
      <PreviewModal />
    </InboxProvider>
  );
}
