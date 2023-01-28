import { GetServerSideProps } from "next";
import { useState } from "react";
import { prisma } from "@/lib/prisma";
import { useRouter } from "next/router";

interface FormData {
  title: string;
  content: string;
  id: string;
}
interface Note {
  notes: {
  id: string;
  title: string;
  content: string;
}[]
}

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
      content: true,
    }, orderBy: {
      id: 'asc'
    }

  })

  return {
    props: {
      notes
    },
  };

}




export default function Home({ notes }: Note) {
  const [form, setForm] = useState<FormData>({
    title: "",
    content: "",
    id: "",
  });
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };
    

  async function create(data: FormData) {
    try {
      if(data.id === "") {
      fetch("/api/create", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        }})
        .then(() => {
          setForm({ title: "", content: "", id: "" });
          refreshData();
        });
        }
        else{
          fetch(`/api/note/${data.id}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
              }
          })
          .then(() => {
            setForm({ title: "", content: "", id: "" });
            refreshData();
          });
        }
      } catch (error) {
        console.log(error);
      }
    }


  async function deleteNote(id: string) {
    try {
      fetch(`/api/note/${id}`, {
        method: "Delete",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => {
        refreshData();
    });
    } catch (error) {
      console.log(error);
    }
  }

  async function updateNote (note: {id: string, title: string, content: string}) {
    setForm({ title: note.title, content: note.content, id: note.id });
  }

  const handleSumbit = async (data: FormData) => {
    try {
      await create(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className="text-center font-bold text-2xl mt-4 mb-1">Notes</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSumbit(form);
        }}
        className="w-4/5 min-w-[25%] max-w-screen-sm mx-auto space-y-6 flex flex-col items-stretch"
      >
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border-2 rounded border-gray-600 p-1"
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="border-2 rounded border-gray-600 p-1 resize-none "
          maxLength={200}
          rows={4}
        />
        <div className="text-right">
          <span className="text-sm absolute -ml-10 -mt-5 text-gray-400">{form.content.length}/200</span>
        </div>

        <button type="submit" className="bg-blue-500 text-white p-1">
          Add +
        </button>
      </form>
      <div className="w-auto min-w-[25%] max-w-screen-md mt-20 mx-auto space-y-6 flex flex-col items-stretch">  
        <ul>
          {notes.map((note) => (
            <li key={note.id} className="border-b w-full border-gray-600 p-2">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="font-bold">{note.title}</h3>
                  <p className="text-sm w-full">{note.content}</p>
                </div>
                <button onClick={() => updateNote(note)} className="bg-blue-500 px-3 py-1 mr-3 text-white rounded ">Update</button>
                <button onClick={() => deleteNote(note.id)} className="bg-red-500 px-3 py-1 text-white rounded">X</button>
              </div>
            </li>
          ))}

        </ul>
      </div>
    </div>
  );
}
