const { getDB } = require("../startup/db");

const getDocumentDetail = async (docId, deptId) => {
  const db = getDB();
  let documentDetails;
  try {
    const [document] = await db.query(
      `SELECT doc.doc_id, doc.doc_no, doc.subject, doc.content, doc.description,doc.date_time,doc.update_time,d_origin.name as origin,d_recepient.name as recepient
    FROM document doc
    JOIN transaction t ON t.doc_id = doc.doc_id
	JOIN department d_origin ON d_origin.dept_id = t.origin
    JOIN department d_recepient ON d_recepient.dept_id = t.recipient
    WHERE doc.doc_id = ?;`,
      [docId]
    );
    console.log(deptId, docId);

    const [readOnly] = await db.query(
      `SELECT readOnly 
    FROM document_readOnly
    WHERE doc_id = ? AND dept_id = ?;`,
      [docId, deptId]
    );

    documentDetails = document[0];
    documentDetails = { ...documentDetails, ...readOnly[0] };
    console.log(readOnly);
    console.log(documentDetails);
    return documentDetails;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = getDocumentDetail;
