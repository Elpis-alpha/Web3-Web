import { useEffect, useState } from "react"
import StudentIntroCard from "./StudentIntroCard"
import { StudentIntro } from "@/source/models/StudentIntro"

const StudentIntroList = () => {
  const [intros, setIntro] = useState<StudentIntro[]>([])

  useEffect(() => {
    setIntro(StudentIntro.mocks)
  }, [])

  return (
    <div className="flex flex-col w-full max-w-[500px] pt-10">
      <h2 className="text-xl font-semibold mb-4">Introductions</h2>
      {intros.map((intro, i) => <StudentIntroCard key={intro.name + '-' + i} name={intro.name} message={intro.message} />)}
    </div>
  )
}
export default StudentIntroList