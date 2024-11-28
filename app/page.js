import DynamicForm from "@/components/DynamicForm";
import { formData } from "@/constants";
import Image from "next/image";

export default function Home() {
  return (
     <div className="p-12">
       <h1 className="text-primary font-bold text-3xl">Test APP</h1>
       <DynamicForm formData={formData} />
     </div>
  );
}
