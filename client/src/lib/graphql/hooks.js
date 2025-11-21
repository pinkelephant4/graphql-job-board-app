import { useQuery } from "@apollo/client/react";
import { CompanyByIdQuery } from "./queries";

export const useCompany = (id) => {
    const { data, loading, error } = useQuery(CompanyByIdQuery, {
        variables: { id },
    });
    return { company: data?.company, loading, error: Boolean(error) };
};
