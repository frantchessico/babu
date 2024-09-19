"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";

import { Endpoint } from "@/lib/db";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  endpoints: Endpoint[];
}

export function DataTableToolbar<TData>({
  table,
  endpoints,
}: DataTableToolbarProps<TData>) {
  const endpointFilters = endpoints.map((endpoint) => ({
    value: endpoint.name,
    label: endpoint.name,
    icon: undefined,
  }));

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter leads by ID..."
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("endpoint") && (
          <DataTableFacetedFilter
            column={table.getColumn("endpoint")}
            title="Endpoints"
            options={endpointFilters}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}



// "use client";

// import { Cross2Icon } from "@radix-ui/react-icons";
// import { Table } from "@tanstack/react-table";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
// import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
// import { Endpoint } from "@/lib/db";
// import { createSegment } from "@/lib/data/segments"; // Import your createSegment function
// import { useSession } from "next-auth/react"; // Import NextAuth hook
// import { toast } from "sonner"; // Importa o toast do Sonner

// interface DataTableToolbarProps<TData> {
//   table: Table<TData>;
//   endpoints: Endpoint[];
// }

// export function DataTableToolbar<TData>({
//   table,
//   endpoints,
// }: DataTableToolbarProps<TData>) {
//   const [open, setOpen] = useState(false); // Estado para controlar a visibilidade do modal
//   const [segmentName, setSegmentName] = useState(""); // Estado para o nome do segmento
//   const [tags, setTags] = useState<string[]>([]); // Estado para as tags em formato de chips
//   const [currentTag, setCurrentTag] = useState(""); // Estado para o valor do input de tags
//   const { data: session } = useSession(); // Hook para pegar a sessão do usuário

//   const endpointFilters = endpoints.map((endpoint) => ({
//     value: endpoint.name,
//     label: endpoint.name,
//     icon: undefined,
//   }));

//   const isFiltered = table.getState().columnFilters.length > 0;

//   const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && currentTag.trim()) {
//       e.preventDefault();
//       setTags((prevTags) => [...prevTags, currentTag.trim()]); // Adiciona o valor de currentTag ao array de tags
//       setCurrentTag(""); // Limpa o input após adicionar a tag
//     }
//   };

//   const handleRemoveTag = (tagToRemove: string) => {
//     setTags((prevTags) => prevTags.filter(tag => tag !== tagToRemove)); // Remove a tag do array de tags
//   };

//   const handleCreateSegment = async () => {
//     try {
//       const userId = session?.user?.id; // Pega o userId da sessão (se disponível)

//       if (!userId) {
//         console.error("User is not authenticated");
//         toast.error("You must be logged in to create a segment.");
//         return;
//       }

//       // Chamar o service createSegment passando o userId
//       await createSegment({
//         name: segmentName,
//         tags: tags,
//         userId, // Passa o userId ao criar o segmento
//       });

//       // Mostrar mensagem de sucesso no toast
//       toast.success("Segment created successfully!");

//       // Limpar o estado após a criação
//       setSegmentName("");
//       setTags([]);
//       setOpen(false);
//     } catch (error) {
//       console.error("Error creating segment:", error);
//       toast.error("Failed to create segment.");
//     }
//   };

//   return (
//     <div className="flex items-center justify-between">
//       <div className="flex flex-1 items-center space-x-2">
//         <Input
//           placeholder="Filter segments by ID..."
//           value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
//           onChange={(event) =>
//             table.getColumn("id")?.setFilterValue(event.target.value)
//           }
//           className="h-8 w-[150px] lg:w-[250px]"
//         />
//         {table.getColumn("endpoint") && (
//           <DataTableFacetedFilter
//             column={table.getColumn("endpoint")}
//             title="Endepoint"
//             options={endpointFilters}
//           />
//         )}
//         {isFiltered && (
//           <Button
//             variant="ghost"
//             onClick={() => table.resetColumnFilters()}
//             className="h-8 px-2 lg:px-3"
//           >
//             Reset
//             <Cross2Icon className="ml-2 h-4 w-4" />
//           </Button>
//         )}
//       </div>
//       <div className="flex space-x-2">
//         <Button className="h-8 px-2" onClick={() => setOpen(true)}>
//           +segment
//         </Button>
//         {/* Botão para abrir o modal */}
//         <DataTableViewOptions table={table} />
//       </div>

//       {/* Modal de criação de segmento */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           {/* O modal pode ser controlado por esse botão, mas estamos usando o estado diretamente */}
//         </DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Create New Segment</DialogTitle>
//             <DialogDescription>
//               Fill in the details below to create a new segment.
//             </DialogDescription>
//           </DialogHeader>
//           <form
//             className="space-y-4"
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleCreateSegment();
//             }}
//           >
//             <div>
//               <Input
//                 id="segment-name"
//                 placeholder="Enter segment name"
//                 value={segmentName}
//                 onChange={(e) => setSegmentName(e.target.value)}
//               />
//             </div>

//             <div>
//               <Input
//                 id="tags"
//                 placeholder="Enter tags and press Enter"
//                 value={currentTag}
//                 onChange={(e) => setCurrentTag(e.target.value)}
//                 onKeyDown={handleAddTag} // Pressionar Enter para adicionar a tag
//               />
//             </div>

//             {/* Exibir chips das tags */}
//             <div className="flex flex-wrap gap-2">
//               {tags.map((tag, index) => (
//                 <div key={index} className="flex items-center bg-gray-200 px-2 py-1 rounded-full">
//                   <span className="mr-2">{tag}</span>
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveTag(tag)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     <Cross2Icon />
//                   </button>
//                 </div>
//               ))}
//             </div>

//             <DialogClose asChild>
//               <Button type="submit" className="w-full btn-sm"> {/* Botão ocupando toda a largura */}
//                 Create
//               </Button>
//             </DialogClose>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
