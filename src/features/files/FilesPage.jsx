import { useState } from "react";

export default function FilesPage() {


  const files = [

    {
      id: 1,
      title: "انكليزي",
      description: "فنر الدباغ  25",
      file: "/files/file1.pdf"
    },

    {
      id: 2,
      title: "رياضيات",
      description: "علا الصراف 27",
      file: "/files/file2.pdf"
    },

    {
      id: 3,
      title: "طبيعيات",
      description: "علا الصراف 27",
      file: "/files/file3.pdf"
    },

    {
      id: 4,
      title: "شبكات",
      description: "علا الصراف 27",
      file: "/files/file4.pdf"
    },

    {
      id: 5,
      title: "صيانة",
      description: "علا الصراف 27",
      file: "/files/file5.pdf"
    },

    {
      id: 6,
      title: "معالجات",
      description: "علا الصراف 27",
      file: "/files/file6.pdf"
    },

    {
      id: 7,
      title: "عربي",
      description: "عباس علي",
      file: "/files/file7.pdf"
    },

    {
      id: 8,
      title: " اسلامية",
      description: "عمار فاضل 27",
      file: "/files/file8.pdf"
    }

  ];



  const [search, setSearch] = useState("");



  const filteredFiles = files.filter((file) =>
    file.title.includes(search)
  );



  return (

    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        color: "white"
      }}
    >


      <h1>
        📂 الملفات الدراسية
      </h1>


      <p>
        اختر الملف الذي تريد فتحه
      </p>



      <input

        type="text"

        placeholder="🔍 البحث عن ملف"

        value={search}

        onChange={(e) => setSearch(e.target.value)}

      />



      <div

        style={{
          display: "grid",
          gridTemplateColumns:
          "repeat(auto-fit,minmax(260px,1fr))",

          gap: "20px",

          marginTop: "25px"
        }}

      >


        {filteredFiles.map((file) => (


          <div

            className="card"

            key={file.id}

          >


            <h2>
              📄 {file.title}
            </h2>


            <p>
              {file.description}
            </p>



            <a

              href={file.file}

              target="_blank"

              rel="noreferrer"

            >

              <button>

                📥 فتح الملف

              </button>


            </a>



          </div>


        ))}



      </div>



    </div>

  );

}