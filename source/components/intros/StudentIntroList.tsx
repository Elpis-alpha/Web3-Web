import { useEffect, useState } from "react"
import StudentIntroCard from "./StudentIntroCard"
import { StudentIntro } from "@/source/models/StudentIntro"
import { useConnection } from "@solana/wallet-adapter-react"
import { StudentIntroCoordinator } from "@/source/models/StudentIntroCoordinator"

const STUDENT_INTRO_PROGRAM_ID = "HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf"
const StudentIntroList = () => {
  const [intros, setIntro] = useState<StudentIntro[]>([])
  const [page, setPage] = useState(1)
  const { connection } = useConnection()
  const [search, setSearch] = useState('')

  useEffect(() => {
    StudentIntroCoordinator.fetchPage(
      connection,
      page,
      10,
      search,
      search !== ''
    ).then(setIntro)
  }, [page, search])

  return (
    <div className="flex flex-col w-full max-w-[500px] pt-10">
      <h2 className="text-xl font-semibold mb-4">Introductions</h2>
      <div className="pb-3">
        <input type="text" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-dark-blue"
          onChange={event => setSearch(event.currentTarget.value)}
        />
      </div>
      {intros.map((intro, i) => <StudentIntroCard key={intro.name + '-' + i} name={intro.name} message={intro.message} />)}
      <div className="flex gap-3 items-center justify-center">
        {page > 1 && <button className="flex min-w-[110px] justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1.5 bg-white shake" onClick={() => setPage(page - 1)}>Previous</button>}
        {StudentIntroCoordinator.accounts.length > page * 2 &&
          <button className="flex min-w-[110px] justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1.5 bg-white shake" onClick={() => setPage(page + 1)}>Next</button>}
      </div>
    </div>
  )
}
export default StudentIntroList