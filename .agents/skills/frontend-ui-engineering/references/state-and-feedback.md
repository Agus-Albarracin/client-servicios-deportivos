# State and Feedback

Every user-visible request has a lifecycle. Make its pending, success, empty, failure, and retryable outcomes understandable without leaving the user to infer what happened.

Use local pending feedback for local actions. Preserve stable content while nearby data refreshes when that prevents visual jumps. Empty states must distinguish no data, no search result, no access, and no configured content. Errors should protect entered input and offer recovery when one exists.

Use optimistic updates only when a change is low-risk, reversible, and has a clear rollback path. Never present an unconfirmed destructive action as complete.
