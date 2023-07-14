const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (req, h) => {
  const {name, year, author, summary,
    publisher, pageCount, readPage, reading} = req.payload;

  const id = nanoid(20);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id, name, year, author, summary,
    publisher, pageCount, readPage, finished, reading,
    insertedAt, updatedAt,
  };
  books.push(newBook);

  // const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku.' +
      ' readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

// const getAllBookHandler = () => ({
//   status: 'success',
//   data: {
//     books,
//   },
// });

const getAllBookHandler = (req, h) => {
  const {finished, name, reading} = req.query;
  // const filterName = books.filter((book) =>
  //   book.name.toLowerCase() === name.toLowerCase());

  if (req.query) {
    if (finished === '1') {
      const filterBooksFinished = books.filter((b) => b.finished === true);
      const fixBooksFinished = filterBooksFinished.map((book) => {
        const {id, name, publisher} = book;
        if ((Object.keys(book)[1] === 'name')&&
        (book.readPage <= book.pageCount)) {
          return {
            id, name, publisher,
          };
        }
        return;
      });
      return {
        status: 'success',
        data: {
          books: fixBooksFinished,
        },
      };
    } else if (finished === '0') {
      const filterBooksUnfinished = books.filter((b) => b.finished === false);
      const fixBooksUnfinished = filterBooksUnfinished.map((book) => {
        const {id, name, publisher} = book;
        if ((Object.keys(book)[1] === 'name')&&
        (book.readPage <= book.pageCount) && name !== undefined && !null) {
          return {
            id, name, publisher,
          };
        }
        return;
      });
      return {
        status: 'success',
        data: {
          books: fixBooksUnfinished,
        },
      };
    } else if (reading === '1') {
      const filterBooksReading = books.filter((b) => b.reading === true);
      const fixBooksReading = filterBooksReading.map((book) => {
        const {id, name, publisher} = book;
        if ((Object.keys(book)[1] === 'name')&&
        (book.readPage <= book.pageCount)) {
          return {
            id, name, publisher,
          };
        }
        return;
      });
      return {
        status: 'success',
        data: {
          books: fixBooksReading,
        },
      };
    } else if (reading === '0') {
      const filterBooksUnreading = books.filter((b) => b.reading === false);
      const fixBooksUnreading = filterBooksUnreading.map((book) => {
        const {id, name, publisher} = book;
        if ((Object.keys(book)[1] === 'name')&&
        (book.readPage <= book.pageCount)) {
          return {
            id, name, publisher,
          };
        }
        return;
      });
      return {
        status: 'success',
        data: {
          books: fixBooksUnreading,
        },
      };
    } else if (name) {
      const filterBooksName = books.filter((b) => b.name === name);
      const fixBooksName = filterBooksName.map((book) => {
        const {id, name, publisher} = book;
        if ((Object.keys(book)[1] === 'name')&&
        (book.readPage <= book.pageCount)) {
          return {
            id, name, publisher,
          };
        }
        return;
      });
      return {
        status: 'success',
        data: {
          books: fixBooksName,
        },
      };
    }
  }

  const newBooks = books.map((book) => {
    const {id, name, publisher} = book;
    if ((Object.keys(book)[1] === 'name')&&
    (book.readPage <= book.pageCount)) {
      return {
        id, name, publisher,
      };
    }
    return;
  });
  return {
    status: 'success',
    data: {
      books: newBooks.filter(Boolean).filter((book) => book.name),
    },
  };
};

const getBookByIdHandler = (req, h) => {
  const {bookId} = req.params;
  const book = books.filter((b) => b.id === bookId)[0];

  if (book) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (req, h) => {
  const {bookId} = req.params;

  const {name, year, author, summary,
    publisher, pageCount, readPage, reading} = req.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    } else if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku.' +
        ' readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (req, h) => {
  const {bookId} = req.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
