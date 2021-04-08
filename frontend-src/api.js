const PREFIX = "/dashboard";

const req = (url, options = {}) => {
  const { body } = options;
  debugger

  return fetch((PREFIX + url).replace(/\/\/$/, ""), {
    ...options,
    body: body ? JSON.stringify(body) : null,
    headers: {
      ...options.headers,
      ...(body
        ? {
            "Content-Type": "application/json",
          }
        : null),
    },
  }).then((res) =>
    res.ok
      ? res.json()
      : res.text().then((message) => {
          throw new Error(message);
        })
  );
};

export const getNotes = async ({ age, search, page } = {}) => {
  try {
    // TODO age search page
    return req('/notes');
  } catch (e) {
    console.error(e);
  }
};

export const createNote = async (title, text) => {
  const requestOptions = {
    method: 'POST',
    body: { title, text }
  };

  try {
    return req('/notes/new', requestOptions);
  } catch (e) {
    console.error(e);
  }
};

export const getNote = async (id) => {
  console.log("GETTING NOTE")
  try {
    console.log(req(`/note/${id}`));
    return req(`/note/${id}`);
  } catch (e) {
    console.error(e);
  }
};

export const archiveNote = {};

export const unarchiveNote = {};

export const editNote = (id, title, text) => {};

export const deleteNote = (id) => {};

export const deleteAllArchived = () => {};

export const notePdfUrl = (id) => {};
