"use client";
/*
Note: "use client" is a Next.js App Router directive that tells React to render the component as
a client component rather than a server component. This establishes the server-client boundary,
providing access to client-side functionality such as hooks and event handlers to this component and
any of its imported children. Although the SpeciesCard component itself does not use any client-side
functionality, it is beneficial to move it to the client because it is rendered in a list with a unique
key prop in species/page.tsx. When multiple component instances are rendered from a list, React uses the unique key prop
on the client-side to correctly match component state and props should the order of the list ever change.
React server components don't track state between rerenders, so leaving the uniquely identified components (e.g. SpeciesCard)
can cause errors with matching props and state in child components if the list order changes.
*/
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";
import Image from "next/image";
import { useState } from "react";
import EditSpecies from "./edit-species";
type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesCard({ species, userId }: { species: Species; userId: string }) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div>
      <div
        style={{ minHeight: "490px" }}
        className="m-4 flex w-72 min-w-72 flex-none flex-col justify-between rounded border-2 p-3 shadow"
      >
        {species.image && (
          <div className="relative h-40 w-full">
            <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
          </div>
        )}
        <h3 className="mt-3 text-2xl font-semibold">
          {species.scientific_name && species.scientific_name.length < 20
            ? species.scientific_name
            : species.scientific_name.slice(0, 20).trim() + "..."}
        </h3>
        <h4 className="text-lg font-light italic">{species.common_name}</h4>
        <p>{species.description ? species.description.slice(0, 120).trim() + "..." : ""}</p>
        <Button className="relative mt-3 w-full flex-none" onClick={() => setOpen(!open)}>
          Learn More
        </Button>
        {userId === species.author && <EditSpecies species={species} userId={userId} />}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-y-auto sm:max-w-[700px] lg:max-h-[10000px]">
          <DialogHeader>
            <DialogTitle className="mt-3 text-2xl">Scientific Name: {species.scientific_name}</DialogTitle>
            {species.image && (
              <div className="sticky h-80 w-full">
                <Image
                  src={species.image}
                  alt={species.scientific_name}
                  fill
                  style={{ objectFit: "contain", objectPosition: "center" }}
                />
              </div>
            )}
            <h4 className="text-md mt-3 font-light italic">
              <b>Common Name:</b> {species.common_name}
            </h4>
            <p className="text-md mt-3 font-light tracking-tight">
              <b>Description:</b> {species.description}
            </p>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
