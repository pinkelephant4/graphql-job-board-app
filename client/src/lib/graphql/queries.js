import { GraphQLClient, gql } from "graphql-request";
import { getAccessToken } from "../auth";

const client = new GraphQLClient("http://localhost:4000/graphql", {
    headers: () => {
        const token = getAccessToken();
        if (token) {
            return { Authorization: `Bearer ${token}` };
        }
        return {};
    },
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
    const { job } = await client.request(mutation, { input: { title, description } });
    return job;
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
    const { company } = await client.request(query, { id });
    return company;
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
    const { job } = await client.request(query, { id });
    return job;
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
    const { jobs } = await client.request(query);
    return jobs;
};
