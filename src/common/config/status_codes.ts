export const status_code = {
    success : {
        code: 200,
		status: "success",
    },
	invalid_input: {
		code: 422,
		status: "error",
	},
	invalid_query: {
		code: 500,
		status: "error",
	},
	no_results: {
		code: 200,
		status: "success",
	},
	fatal_error: {
		code: 500,
		status: "error",
	},
	not_found: {
		code: 404,
		status: "not_found",
	},
	bad_request: {
		code: 400,
		status: "bad_request",
	},
	unauthorized: {
		code: 401,
		status: "unauthorized",
	},
}