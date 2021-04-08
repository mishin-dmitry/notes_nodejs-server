const PREFIX = "/dashboard";

const req = (url, options = {}) => {
  const { body } = options;

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
    {
      return  res.ok
        ? res.json()
        : res.text().then((message) => {
          throw new Error(message);
        })
    }
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
  try {
    return req(`/note/${id}`);
  } catch (e) {
    console.error(e);
  }
};

export const archiveNote = async (id) => {
  const requestOption = { method: 'PUT' };

  try {
    await req(`/note/${id}/archive`, requestOption);
  } catch (e) {
    console.error(e);
  }
};

export const unarchiveNote = async (id) => {
  const requestOption = { method: 'PUT' };

  try {
    await req(`/note/${id}/unarchive`, requestOption);
  } catch (e) {
    console.error(e);
  }
};

export const editNote = (id, title, text) => {};

export const deleteNote = (id) => {};

export const deleteAllArchived = () => {};

export const notePdfUrl = (id) => {};
