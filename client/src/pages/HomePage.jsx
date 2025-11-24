import { useState } from "react";
import JobList from "../components/JobList";
import { useJobs } from "../lib/graphql/hooks";

const JOBS_PER_PAGE = 7;

function HomePage() {
    const [currPage, setCurrPage] = useState(1);
    const { jobs, loading, error } = useJobs(JOBS_PER_PAGE, (currPage - 1) * JOBS_PER_PAGE);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="has-text-danger">Data Unavailable</div>;

    let totalPages = Math.ceil(jobs.totalCount / JOBS_PER_PAGE);

    return (
        <div>
            <h1 className="title">Job Board</h1>
            <div>
                <button
                    disabled={currPage <= 1}
                    onClick={() => {
                        setCurrPage((prev) => prev - 1);
                    }}
                >
                    Previous
                </button>
                <span>{`${currPage} of ${totalPages}`}</span>
                <button
                    disabled={currPage >= totalPages}
                    onClick={() => {
                        setCurrPage((prev) => prev + 1);
                    }}
                >
                    Next
                </button>
            </div>
            <JobList jobs={jobs.items} />
        </div>
    );
}

export default HomePage;
