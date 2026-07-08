import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import LessonsPage from "./features/lessons/LessonsPage";
import FilesPage from "./features/files/FilesPage";

import { useEffect, useState } from "react";



function AI(){

  const [input,setInput]=useState("");
  const [response,setResponse]=useState("");
  const [loading,setLoading]=useState(false);



  async function handleSend(){

    if(!input.trim()) return;

    setLoading(true);


    try{

      const res = await fetch(
        "http://localhost:3001/api/ai",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            message:input
          })
        }
      );


      const data = await res.json();

      setResponse(
        data.reply || "لا يوجد رد"
      );


    }catch{

      setResponse(
        "❌ السيرفر غير متصل"
      );

    }


    setLoading(false);

  }



  return (

    <div style={{

      minHeight:"100vh",

      padding:30,

      color:"white",

      background:
      "linear-gradient(135deg,#020617,#312e81)"

    }}>


      <h1>
        🤖 Study Hub AI
      </h1>



      <textarea

        value={input}

        onChange={(e)=>setInput(e.target.value)}

        placeholder="اكتب سؤالك..."

        style={{

          width:"100%",

          height:140,

          padding:20,

          borderRadius:20,

          background:"#0f172a",

          color:"white",

          border:"1px solid #6366f1"

        }}

      />



      <button

        onClick={handleSend}

        style={{

          marginTop:15,

          padding:"14px 35px",

          borderRadius:30,

          border:0,

          color:"white",

          background:
          "linear-gradient(135deg,#8b5cf6,#06b6d4)"

        }}

      >

        {loading?"🧠 جاري التفكير":"🚀 إرسال"}

      </button>



      <p style={{

        marginTop:25,

        fontSize:18

      }}>

        {response}

      </p>


    </div>

  );

}






function Home(){

  const saved =
  JSON.parse(
    localStorage.getItem("timer")
  );


  const [minutes,setMinutes]=useState(
    saved?.minutes || 25
  );


  const [seconds,setSeconds]=useState(
    saved?.seconds || 1500
  );


  const [running,setRunning]=useState(
    saved?.running || false
  );


  const [sessions,setSessions]=useState(
    Number(localStorage.getItem("sessions")) || 0
  );



  useEffect(()=>{

    localStorage.setItem(
      "timer",
      JSON.stringify({

        minutes,
        seconds,
        running

      })
    );

  },[
    minutes,
    seconds,
    running
  ]);



  useEffect(()=>{


    if(!running) return;



    const timer=setInterval(()=>{


      setSeconds(prev=>{


        if(prev<=1){


          setRunning(false);


          const newSessions=sessions+1;


          setSessions(newSessions);


          localStorage.setItem(
            "sessions",
            newSessions
          );


          alert(
            "🎉 انتهت جلسة التركيز"
          );


          return minutes*60;

        }


        return prev-1;

      });


    },1000);



    return ()=>clearInterval(timer);


  },[running]);



  function chooseTime(t){

    setMinutes(t);

    setSeconds(t*60);

    setRunning(false);

  }
    const min = Math.floor(seconds / 60);

  const sec = seconds % 60;


  const progress =
  ((minutes * 60 - seconds) /
  (minutes * 60)) * 100;



  return (

    <div

      style={{

        minHeight:"100vh",

        display:"flex",

        justifyContent:"center",

        alignItems:"center",

        padding:25,

        color:"white",

        background:

        "radial-gradient(circle at top,#9333ea,#020617 70%)"

      }}

    >



      <div

        style={{

          width:480,

          padding:40,

          borderRadius:40,

          background:

          "rgba(255,255,255,.08)",

          backdropFilter:"blur(25px)",

          border:

          "1px solid rgba(255,255,255,.15)",

          boxShadow:

          "0 30px 80px rgba(0,0,0,.5)",

          textAlign:"center"

        }}

      >



        <h1>
          📚 Study Hub AI
        </h1>


        <p>
          ركز وحقق أهدافك 🚀
        </p>




        <h3>
          ⏱️ مدة التركيز
        </h3>



        <div>


          {[15,25,50,90].map(t=>(


            <button

              key={t}

              onClick={()=>chooseTime(t)}

              style={{

                margin:6,

                padding:"12px 20px",

                borderRadius:25,

                border:0,

                cursor:"pointer",

                color:"white",

                background:

                minutes===t

                ?

                "linear-gradient(135deg,#f59e0b,#ec4899)"

                :

                "#334155"

              }}

            >

              {t} دقيقة

            </button>


          ))}


        </div>






        <div

          style={{

            width:310,

            height:310,

            margin:"45px auto",

            borderRadius:"50%",

            background:

            `conic-gradient(

              #facc15 ${progress}%,

              rgba(255,255,255,.15) ${progress}%

            )`,

            display:"flex",

            justifyContent:"center",

            alignItems:"center",

            boxShadow:

            "0 0 70px rgba(250,204,21,.35)"

          }}

        >



          <div

            style={{

              width:250,

              height:250,

              borderRadius:"50%",

              background:

              "linear-gradient(145deg,#020617,#1e1b4b)",

              display:"flex",

              flexDirection:"column",

              justifyContent:"center",

              alignItems:"center"

            }}

          >



            <div

              style={{

                fontSize:58,

                fontWeight:"900",

                color:"#fef3c7"

              }}

            >

              {String(min).padStart(2,"0")}:
              {String(sec).padStart(2,"0")}

            </div>



            <p>

              {running

              ?

              "🔥 جاري التركيز"

              :

              "⏳ جاهز"}

            </p>



          </div>


        </div>





        <button

          onClick={()=>setRunning(!running)}

          style={{

            width:"90%",

            padding:18,

            borderRadius:35,

            border:0,

            cursor:"pointer",

            color:"white",

            fontSize:19,

            background:

            running

            ?

            "linear-gradient(135deg,#ef4444,#f97316)"

            :

            "linear-gradient(135deg,#22c55e,#06b6d4)"

          }}

        >

          {running

          ?

          "⏸ إيقاف"

          :

          "▶️ بدء"}

        </button>





        <button

          onClick={()=>{

            setRunning(false);

            setSeconds(minutes*60);

          }}

          style={{

            marginTop:15,

            width:"90%",

            padding:15,

            borderRadius:35,

            border:0,

            cursor:"pointer",

            color:"white",

            background:

            "linear-gradient(135deg,#dc2626,#7f1d1d)"

          }}

        >

          🔄 إعادة ضبط

        </button>
                <div

          style={{

            marginTop:30,

            padding:25,

            borderRadius:30,

            background:

            "rgba(255,255,255,.08)",

            border:

            "1px solid rgba(255,255,255,.15)"

          }}

        >

          <h2>
            🏆 جلسات التركيز
          </h2>


          <h1

            style={{

              color:"#facc15",

              fontSize:45

            }}

          >

            {sessions}

          </h1>


        </div>


      </div>


    </div>


  );


}







function Dashboard(){


  const sessions =
  Number(localStorage.getItem("sessions")) || 0;


  const xp = sessions * 50;


  const level =
  Math.floor(xp / 200) + 1;


  const progress =
  (xp % 200) / 2;



  const [tasks,setTasks]=useState(

    JSON.parse(
      localStorage.getItem("tasks")
    ) || []

  );



  const [task,setTask]=useState("");





  function saveTasks(data){

    setTasks(data);

    localStorage.setItem(
      "tasks",
      JSON.stringify(data)
    );

  }




  function addTask(){

    if(!task.trim()) return;


    saveTasks([

      ...tasks,

      {

        id:Date.now(),

        text:task,

        done:false

      }

    ]);


    setTask("");

  }





  function toggleTask(id){

    saveTasks(

      tasks.map(t=>

        t.id===id

        ?

        {
          ...t,
          done:!t.done
        }

        :

        t

      )

    );

  }





  function deleteTask(id){

    saveTasks(

      tasks.filter(
        t=>t.id!==id
      )

    );

  }





  return (

    <div

      style={{

        minHeight:"100vh",

        padding:35,

        color:"white",

        background:

        "linear-gradient(135deg,#020617,#312e81)"

      }}

    >



      <h1>
        📊 لوحة الطالب Pro
      </h1>




      <div

        style={{

          padding:30,

          borderRadius:35,

          background:

          "rgba(255,255,255,.1)",

          backdropFilter:"blur(20px)"

        }}

      >


        <h2>
          ⭐ المستوى {level}
        </h2>


        <h3>
          XP : {xp}
        </h3>



        <div

          style={{

            height:18,

            background:"#334155",

            borderRadius:20,

            overflow:"hidden"

          }}

        >


          <div

            style={{

              width:`${progress}%`,

              height:"100%",

              background:

              "linear-gradient(90deg,#facc15,#22c55e)"

            }}

          />


        </div>


      </div>





      <div

        style={{

          marginTop:35,

          padding:30,

          borderRadius:35,

          background:

          "rgba(255,255,255,.08)"

        }}

      >


        <h2>
          📝 مهام اليوم
        </h2>



        <input

          value={task}

          onChange={(e)=>setTask(e.target.value)}

          onKeyDown={(e)=>{

            if(e.key==="Enter") addTask();

          }}

          placeholder="اكتب مهمة..."

          style={{

            padding:15,

            borderRadius:18,

            width:"70%",

            background:"#020617",

            color:"white",

            border:"1px solid #475569"

          }}

        />



        <button

          onClick={addTask}

          style={{

            margin:10,

            padding:"14px 25px",

            borderRadius:20,

            border:0,

            cursor:"pointer",

            color:"white",

            background:

            "linear-gradient(135deg,#06b6d4,#2563eb)"

          }}

        >

          ➕ إضافة

        </button>
                {

          tasks.map(t=>(


            <div

              key={t.id}

              style={{

                marginTop:15,

                padding:18,

                borderRadius:22,

                display:"flex",

                justifyContent:"space-between",

                alignItems:"center",

                background:

                t.done

                ?

                "rgba(34,197,94,.25)"

                :

                "rgba(255,255,255,.1)"

              }}

            >



              <span

                onClick={()=>toggleTask(t.id)}

                style={{

                  cursor:"pointer",

                  textDecoration:

                  t.done

                  ?

                  "line-through"

                  :

                  "none"

                }}

              >

                {t.done?"✅":"📌"} {t.text}

              </span>




              <button

                onClick={()=>deleteTask(t.id)}

                style={{

                  background:"#ef4444",

                  color:"white",

                  border:0,

                  padding:"8px 15px",

                  borderRadius:15,

                  cursor:"pointer"

                }}

              >

                🗑️

              </button>



            </div>


          ))

        }



      </div>



    </div>

  );


}







function Subjects(){


  return (

    <div

      style={{

        minHeight:"100vh",

        padding:30,

        color:"white",

        background:"#020617"

      }}

    >

      <h1>
        📚 المواد
      </h1>


      <p>
        جميع المواد الدراسية
      </p>


    </div>

  );


}








export default function App(){


  return (

    <BrowserRouter>


      <Navbar />



      <Routes>


        <Route

          path="/"

          element={<Home/>}

        />



        <Route

          path="/dashboard"

          element={<Dashboard/>}

        />



        <Route

          path="/subjects"

          element={<Subjects/>}

        />



        <Route

          path="/ai"

          element={<AI/>}

        />



        <Route

          path="/files"

          element={<FilesPage/>}

        />



        <Route

          path="/lessons"

          element={<LessonsPage/>}

        />


      </Routes>


    </BrowserRouter>

  );


}