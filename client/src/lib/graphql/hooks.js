import { useQuery } from "@apollo/client/react";
import { CompanyByIdQuery, getAllJobs, JobByIdQuery } from "./queries";

export const useCompany = (id) => {
    const { data, loading, error } = useQuery(CompanyByIdQuery, {
        variables: { id },
    });
    return { company: data?.company, loading, error: Boolean(error) };
};

export const useJob = (id) => {
    const { data, loading, error } = useQuery(JobByIdQuery, {
        variables: { id },
    });
    return { job: data?.job, loading, error: Boolean(error) };
};

export const useJobs = () => {
    const { data, loading, error } = useQuery(getAllJobs, {
        fetchPolicy: "network-only",
        // 'network-only' -> only get data from network/server
        // 'cache-first' -> apolloClient gets data from cache first, if not in cache then calls server. (default)
    });
    return { jobs: data?.jobs, loading, error: Boolean(error) };
};
