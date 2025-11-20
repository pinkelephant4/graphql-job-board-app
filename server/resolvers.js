import { GraphQLError } from "graphql";
import { getCompany } from "./db/companies.js";
import { createJob, deleteJob, getJob, getJobs, getJobsByCompany, updateJob } from "./db/jobs.js";

export const resolvers = {
    Query: {
        company: async (_root, args) => {
            const company = await getCompany(args.id);
            if (!company) throw notFoundError(`No company found with id ${args.id}`);
            return company;
        },
        job: async (_root, args) => {
            const job = await getJob(args.id);
            if (!job) throw notFoundError(`No Job found with id ${args.id}`);
            return job;
        },
        jobs: () => getJobs(),
    },
    Mutation: {
        createJob: (_root, { input: { title, description } }, { user }) => {
            if (!user) {
                throw unAuthorizedError("No Authentication provided.");
            }
            return createJob({ companyId: user.companyId, title, description });
        },
        deleteJob: async (_root, args, { user }) => {
            if (!user) {
                throw unAuthorizedError("No Authentication Provided.");
            }
            const job = await deleteJob(args.id, user.companyId);
            if (!job) throw notFoundError("Job not found: ${id} ");
            return job;
        },

        updateJob: async (_root, { input: { id, title, description } }, { user }) => {
            if (!user) {
                throw unAuthorizedError("No Authentication Provided.");
            }
            const job = await updateJob({ id, title, description }, user.companyId);
            if (!job) throw notFoundError(`Job not found: ${id}`);
            return job;
        },
    },
    Company: {
        jobs: (parent) => getJobsByCompany(parent.id),
    },
    Job: {
        company: (job) => getCompany(job.companyId),
        date: (job) => toISODate(job.createdAt),
    },
};

const toISODate = (date) => {
    return date.slice(0, "yyyy-mm-dd".length);
};

const notFoundError = (message) => {
    return new GraphQLError(message, {
        extensions: { code: "NOT_FOUND" },
    });
};

const unAuthorizedError = (message) => {
    return new GraphQLError(message, {
        extensions: { code: "UNAUTHORIZED" },
    });
};

// const unAuthorizedError = (message) => {
//     return new GraphQLError(message, {
//         extensions: { code: "UNAUTHORIZED" },
//     });
// };
