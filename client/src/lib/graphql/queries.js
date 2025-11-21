import { getAccessToken } from "../auth";
import { ApolloClient, gql, InMemoryCache, HttpLink } from "@apollo/client";

const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
});

export const createJob = async ({ title, description }) => {
    const mutation = gql`
        # defining that this mutation takes a variable called input of type CreateJobInput
        mutation makeJob($input: CreateJobInput!) {
            # alias of job so we can do data.job
            job: createJob(input: $input) {
                # defining that input parameter for the muation is the variable $input.
                id
                title
                description
                date
            }
        }
    `;
    //define the variables to be injected into the request here.
    const { data } = await apolloClient.mutate({
        mutation,
        variables: { input: { title, description } },
    });
    return data.job;
};

export const getCompany = async (id) => {
    const query = gql`
        query getCompanyById($id: ID!) {
            company(id: $id) {
                id
                name
                description
                jobs {
                    id
                    date
                    title
                }
            }
        }
    `;
    const { data } = await apolloClient.query({ query, variables: { id } });
    return data.company;
};

export const getJob = async (id) => {
    const query = gql`
        # naming the query JobById for no other purpose than to directly paste into sandbox and save it there.
        query JobById($id: ID!) {
            job(id: $id) {
                id
                title
                date
                description
                company {
                    id
                    name
                }
            }
        }
    `;
    const { data } = await apolloClient.query({ query, variables: { id } });
    return data.job;
};

export const getJobs = async () => {
    const query = gql`
        query {
            jobs {
                id
                title
                date
                company {
                    id
                    name
                }
            }
        }
    `;
    const { data } = await apolloClient.query({ query });
    return data.jobs;
};
