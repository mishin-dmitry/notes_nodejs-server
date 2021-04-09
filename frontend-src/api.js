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
    const ageParam = age ? `age=${age}` : '';
    const searchParam = search ? `search=${search}` : '';
    const pageParam = page ? `page=${page}` : '';
    const queryParams = [ageParam, searchParam, pageParam]
      .filter(param => param)
      .join("&");
    const queryString = queryParams ? `?${queryParams}` : '';

    return req(`/notes${queryString}`);
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

export const editNote = async (id, title, text) => {
  const requestOption = {
    method: 'PUT',
    body: { title, text }
  };

  try {
    await req(`/note/${id}/edit`, requestOption);
  } catch (e) {
    console.error(e);
  }
};

export const deleteNote = async (id) => {
  const requestOption = { method: 'DELETE' };

  try {
    await req(`/note/${id}/delete`, requestOption);
  } catch (e) {
    console.error(e);
  }
};

export const deleteAllArchived = async () => {
  const requestOption = { method: 'DELETE' };

  try {
    await req("/notes/delete-archived", requestOption);
  } catch (e) {
    console.error(e)
  }
};

export const notePdfUrl = (id) => {
  return `${PREFIX}/note/${id}/download`;
};
