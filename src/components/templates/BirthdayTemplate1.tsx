"use client";

import RsvpForm from "../RsvpForm"; // <-- IMPORT THE FORM
import Image from "next/image";

// Define the shape of the props this component expects
type BirthdayTemplateProps = {
  invitationId: string; // <-- ADD INVITATION ID PROP
  custom_data: {
    hostName?: string;
    eventDate?: string;
    eventLocation?: string;
    mainImage?: string;
  };
};

export default function BirthdayTemplate1({
  invitationId,
  custom_data,
}: Readonly<BirthdayTemplateProps>) {
  // A helper function to format the date nicely
  const formattedDate = custom_data.eventDate
    ? new Date(custom_data.eventDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "A wonderful day";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Display the uploaded image if it exists */}
        {custom_data.mainImage && (
          <div className="relative w-full h-64">
            <Image
              src={custom_data.mainImage}
              alt={custom_data.hostName || "Invitation Photo"}
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover"
            />
          </div>
        )}

        <div className="p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
            You&apos;re Invited!
          </h1>

          <div className="text-center mb-6">
            <p className="text-lg text-gray-600">
              to celebrate the birthday of
            </p>
            <p className="text-5xl font-extrabold text-purple-600 my-4 tracking-tight">
              {custom_data.hostName || "Our Friend"}
            </p>
          </div>

          <div className="space-y-5 text-center border-t border-b border-gray-200 py-5">
            <div>
              <p className="font-semibold text-sm uppercase tracking-wider text-gray-500">
                When
              </p>
              <p className="text-lg text-gray-900">{formattedDate}</p>
            </div>
            <div>
              <p className="font-semibold text-sm uppercase tracking-wider text-gray-500">
                Where
              </p>
              <p className="text-lg text-gray-900">
                {custom_data.eventLocation || "A special place"}
              </p>
            </div>
          </div>

          {/* --- vvv ADD THIS NEW RSVP SECTION vvv --- */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
              RSVP
            </h2>
            <RsvpForm invitationId={invitationId} />
          </div>
          {/* --- ^^^ ADD THIS NEW RSVP SECTION ^^^ --- */}
        </div>
      </div>
    </div>
  );
}
