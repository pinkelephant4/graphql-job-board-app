import { ApolloClient, gql, HttpLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { getAccessToken } from "../auth";

const httpLink = new HttpLink({ uri: "http://localhost:4000/graphql" });

const authLink = new SetContextLink(({ headers }) => {
    const token = getAccessToken();
    if (token) {
        return {
            headers: {
                ...headers,
                Authorization: `Bearer ${token}`,
            },
        };
    }
    return { headers };
});

export const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
    // to set fetch policy for all the queries
    // defaultOptions: {
    //     query: {
    //         fetchPolicy: "network-only ",
    //     },
    //     watchQuery: {
    //         fetchPolicy: "network-only",
    //     },
    // },
});

//fragments for reusability of fields to get for an object type
const jobDetailFragment = gql`
    fragment JobDetail on Job {
        id
        title
        date
        description
        company {
            id
            name
        }
    }
`;

export const JobByIdQuery = gql`
    # naming the query JobById for no other purpose than to directly paste into sandbox and save it there.
    # found a purpose, the operationName is set to the query name in apolloClient when we log operation object, while creating custom links.
    query JobById($id: ID!) {
        job(id: $id) {
            ...JobDetail
        }
    }
    ${jobDetailFragment}
`;

export const getAllJobs = gql`
    query getJobs {
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

export const createJobMutation = gql`
    # defining that this mutation takes a variable called input of type CreateJobInput
    mutation makeJob($input: CreateJobInput!) {
        # alias of job so we can do data.job
        job: createJob(input: $input) {
            # defining that input parameter for the muation is the variable $input.
            ...JobDetail
        }
    }
    ${jobDetailFragment}
`;

export const CompanyByIdQuery = gql`
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
