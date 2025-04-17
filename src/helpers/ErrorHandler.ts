import { HandledError } from "../types/errors.types";
import { GithubSearchResponse } from "../types/githubusers.types";

export const handleErrorMessages = (errorResponse?: Response, responseJson?: GithubSearchResponse): HandledError => {
  // This function handles API error responses and maps them to friendly user-facing messages.
  // It supports both known HTTP error statuses (e.g. 401, 403, 404, 500) and fallback handling
  // for unexpected or network-related errors when the response is unavailable.

  if (!errorResponse) {
    return {
      type: 'unknown',
      message: responseJson?.message || 'An unknown error occurred. Please try again later.'
    };
  }

  switch (errorResponse.status) {
    case 401:
      return {
        type: 'unauthorized',
        message: 'Unauthorized. Please check your credentials.'
      };
    
    case 403:
      if (responseJson?.message?.includes('rate limit')) {
        return {
          type: 'rate_limit',
          message: 'You\'ve hit GitHub\'s rate limit. Please try again later.'
        };
      }
      return {
        type: 'forbidden',
        message: 'Forbidden. You do not have access to this resource.'
      };

    case 404:
      return {
        type: 'not_found',
        message: 'Resource not found.'
      };

    case 500:
      return {
        type: 'server_error',
        message: 'Server error. Please try again later.'
      };

    default:
      return {
        type: 'unknown',
        message: responseJson?.message || 'An unknown error occurred. Please try again later.'
      };
    }
  }
  