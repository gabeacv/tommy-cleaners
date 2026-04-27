import EnquiryInboxClient from "./EnquiryInboxClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Inbox | Tommy Cleaners",
  description: "Manage service enquiries and requests.",
};

export default function AdminInboxPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <EnquiryInboxClient />
    </div>
  );
}
