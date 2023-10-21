// import React, { useState, useEffect } from "react";
// import { Form, Input, Select, Modal, DatePicker, message, Table } from "antd";
// import Layout from "../components/Layout/Layout";
// import axios from "axios";
// import Spinner from "../components/Spinner";
// import moment from "moment";
// import {
//   UnorderedListOutlined,
//   AreaChartOutlined,
//   EditOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";
// import tableView from "../styles/Mytable.css";
// import Analytics from "../components/Analytics";

// const { RangePicker } = DatePicker;

// const dateFormat = "DD-MM-YYYY";

// const HomePage = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [allTransaction, setAllTransaction] = useState([]);
//   const [frequency, setFrequency] = useState("7");
// const [selectedDate, setSelectedDate] = useState([]);
//   const [type, setType] = useState("all");
//   const [viewData, setViewData] = useState("table");
//   const [edittable, setEditTable] = useState(null);
// const [transactionType, setTransactionType] = useState("income");

//   const handleTransactionTypeChange = (value) => {
//     setTransactionType(value);
//   };

//   const columns = [
//     {
//       title: "Date",
//       dataIndex: "date",
//       render: (text) => <span>{moment(text).format("DD-MM-YYYY")}</span>,
//     },
//     {
//       title: "Amount",
//       dataIndex: "amount",
//     },
//     {
//       title: "Type",
//       dataIndex: "type",
//     },
//     {
//       title: "Category",
//       dataIndex: "category",
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//     },
//     {
//       title: "Action",
//       render: (text, record) => (
//         <div>
//           <EditOutlined
//             onClick={() => {
//               setEditTable(record);
//               setShowModal(true);
//             }}
//           />
//           <DeleteOutlined
//             className="mx-2"
//             onClick={() => {
//               handleDelete(record);
//             }}
//           />
//         </div>
//       ),
//     },
//   ];

//   useEffect(() => {
//     // getAll transaction
//     const getAllTransaction = async () => {
//       try {
//         const user = JSON.parse(localStorage.getItem("user"));
//         setLoading(true);
//         const res = await axios.post("/transactions/get-transaction", {
//           userid: user._id,
//           frequency,
//           selectedDate,
//           type,
//         });
//         setLoading(false);
//         setAllTransaction(res.data);
//         console.log(res.data);
//       } catch (error) {
//         console.log(error);
//         message.error("Fetch Issue with Transaction");
//       }
//     };
//     getAllTransaction();
//   }, [frequency, selectedDate, type]);

//   // Delete handler
//   const handleDelete = async (record) => {
//     try {
//       setLoading(true);
//       await axios.post("/transactions/delete-transaction", {
//         transactionId: record._id,
//       });
//       setLoading(false);
//       message.success("Transaction Deleted!");
//     } catch (error) {
//       setLoading(false);
//       console.log(error);
//       message.error("unable to delete");
//     }
//   };
//   const handleSubmit = async (values) => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       setLoading(true);
//       if (edittable) {
//         await axios.post("/transactions/edit-transaction", {
//           payload: { ...values, userId: user._id },
//           transactionId: edittable._id,
//         });
//       } else {
//         await axios.post("/transactions/add-transaction", {
//           ...values,
//           userid: user._id,
//         });
//         setLoading(false);
//         message.success("Transaction Added Successfully");
//       }
//       setShowModal(false);
//       setEditTable(null);
//     } catch (error) {
//       setLoading(false);
//       message.error("Failed to add Transaction");
//     }
//   };
//   return (
//     <Layout>
//       {loading && <Spinner />}
//       <div className="filters">
// <div>
//   <h6>Select Frequency</h6>
//   <Select value={frequency} onChange={(values) => setFrequency(values)}>
//     <Select.Option value="7">Last 1 Week</Select.Option>
//     <Select.Option value="30">Last 1 Month</Select.Option>
//     <Select.Option value="365">Last 1 Year</Select.Option>
//     <Select.Option value="custom">Custom</Select.Option>
//   </Select>
//   {frequency === "custom" && (
//     <RangePicker
//       value={selectedDate}
//       format={dateFormat}
//       onChange={(values) => setSelectedDate(values)}
//       disabledDate={(current) =>
//         current && current > moment().endOf("day")
//       }
//     />
//   )}
// </div>
// <div>
//   <h6>Select Type</h6>
// <Select value={type} onChange={(values) => setType(values)}>
//   <Select.Option value="all">All</Select.Option>
//   <Select.Option value="income">Income</Select.Option>
//   <Select.Option value="expense">Expense</Select.Option>
// </Select>
// </div>
//         <div className="switch-icons">
//           <UnorderedListOutlined
//             className={`mx-2 ${
//               viewData === "table" ? "active-icon" : "inactive-icon"
//             }`}
//             onClick={() => setViewData("table")}
//           />
//           <AreaChartOutlined
//             className={`mx-2 ${
//               viewData === "analytics" ? "active-icon" : "inactive-icon"
//             }`}
//             onClick={() => setViewData("analytics")}
//           />
//         </div>
//         <div>
//           <button
//             className="btn btn-primary"
//             onClick={() => setShowModal(true)}
//           >
//             Add New Transaction
//           </button>
//         </div>
//       </div>

//       <div className="content">
//         {viewData === "table" ? (
//           <Table columns={columns} dataSource={allTransaction} />
//         ) : (
//           <Analytics allTransaction={allTransaction} />
//         )}
//       </div>
//       <Modal
//         title={edittable ? "Edit Transaction" : "Add Transaction"}
//         open={showModal}
//         onCancel={() => setShowModal(false)}
//         footer={false}
//       >
//         <Form
//           layout="vertical"
//           onFinish={handleSubmit}
//           initialValues={edittable}
//         >
//           <Form.Item label="Amount (In Rupees)" name="amount">
//             <Input type="text" />
//           </Form.Item>
//           <Form.Item label="Transaction Type" name="type">
//             <Select onChange={handleTransactionTypeChange}>
//               <Select.Option value="income">Income</Select.Option>
//               <Select.Option value="expense">Expense</Select.Option>
//             </Select>
//           </Form.Item>
// <Form.Item label="Transaction Category" name="category">
//   <Select>
//     {transactionType === "income" ? (
//       <>
//         <Select.Option value="salary">Salary</Select.Option>
//         <Select.Option value="portfolio">
//           Portfolio income(from investments)
//         </Select.Option>
//         <Select.Option value="freelancing">Freelancing</Select.Option>
//       </>
//     ) : (
//       <>
//         <Select.Option value="food">Food</Select.Option>
//         <Select.Option value="transport">Transport</Select.Option>
//         <Select.Option value="shopping">Shopping</Select.Option>
//         <Select.Option value="education">Education</Select.Option>
//         <Select.Option value="entertainment">
//           Entertainment
//         </Select.Option>
//         <Select.Option value="electricbill">
//           Electricity Bill
//         </Select.Option>
//         <Select.Option value="waterbill">Water Bill</Select.Option>
//         <Select.Option value="fastag">Fastage Recharge</Select.Option>
//         <Select.Option value="mobilerecharge">
//           Mobile Recharge
//         </Select.Option>
//         <Select.Option value="hospital">Hospital Bills</Select.Option>
//         <Select.Option value="other">Other</Select.Option>
//       </>
//     )}
//   </Select>
// </Form.Item>
// <DatePicker
//   value={selectedDate[0]}
//   format={dateFormat}
//   onChange={(date) => setSelectedDate([date])}
//   disabledDate={(current) =>
//     current && current > moment().endOf("day")
//   }
// />

//           <Form.Item label="Description" name="description">
//             <Input type="text" />
//           </Form.Item>
//           <div className="d-flex justify-content-end">
//             <button type="submit" className="btn btn-primary">
//               {" "}
//               Add Transaction
//             </button>
//           </div>
//         </Form>
//       </Modal>
//     </Layout>
//   );
// };

// export default HomePage;

// import React, { useState, useEffect } from "react";
// import { Form, Input, Select, Modal, DatePicker, message, Table } from "antd";
// import Layout from "../components/Layout/Layout";
// import axios from "axios";
// import Spinner from "../components/Spinner";
// import moment from "moment";
// import {
//   UnorderedListOutlined,
//   AreaChartOutlined,
//   EditOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";
// import Analytics from "../components/Analytics";
// const { RangePicker } = DatePicker;
// const dateFormat = "DD-MM-YYYY";

// const HomePage = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [allTransaction, setAllTransaction] = useState([]);
//   const [frequency, setFrequency] = useState("7");
//   const [selectedDate, setSelectedDate] = useState([]);
//   const [type, setType] = useState("all");
//   const [viewData, setViewData] = useState("table");
//   const [edittable, setEditTable] = useState(null);
//   const [transactionType, setTransactionType] = useState("income");

//   //table data
//   const columns = [
//     {
//       title: "Date",
//       dataIndex: "date",
//       render: (text) => <span>{moment(text).format("DD-MM-YYYY")}</span>,
//     },
//     {
//       title: "Amount",
//       dataIndex: "amount",
//     },
//     {
//       title: "Type",
//       dataIndex: "type",
//     },
//     {
//       title: "Category",
//       dataIndex: "category",
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//     },
//     {
//       title: "Action",
//       render: (text, record) => (
//         <div>
//           <EditOutlined
//             onClick={() => {
//               setEditTable(record);
//               setShowModal(true);
//             }}
//           />
//           <DeleteOutlined
//             className="mx-2"
//             onClick={() => {
//               handleDelete(record);
//             }}
//           />
//         </div>
//       ),
//     },
//   ];
//   //useEffect Hook
//   useEffect(() => {
//     //getAll transaction
//     const getAllTransaction = async () => {
//       try {
//         const user = JSON.parse(localStorage.getItem("user"));
//         setLoading(true);
//         const res = await axios.post("/transactions/get-transaction", {
//           userid: user._id,
//           frequency,
//           selectedDate,
//           type,
//         });
//         setLoading(false);
//         setAllTransaction(res.data);
//         console.log(res.data);
//       } catch (error) {
//         console.log(error);
//         message.error("Fetch Issue with Transaction");
//       }
//     };
//     getAllTransaction();
//   }, [frequency, selectedDate, type]);

//   //Delete handler
//   const handleDelete = async (record) => {
//     try {
//       setLoading(true);
//       await axios.post("/transactions/delete-transaction", {
//         transactionId: record._id,
//       });
//       setLoading(false);
//       message.success("Transaction Deleted!");
//     } catch (error) {
//       setLoading(false);
//       console.log(error);
//       message.error("unable to delete");
//     }
//   };

//   //Form handling
//   const handleSubmit = async (values) => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       setLoading(true);
//       if (edittable) {
//         await axios.post("/transactions/edit-transaction", {
//           payload: { ...values, userId: user._id },
//           transactionId: edittable._id,
//         });
//       } else {
//         await axios.post("/transactions/add-transaction", {
//           ...values,
//           userid: user._id,
//         });
//         setLoading(false);
//         message.success("Transaction Added Successfully");
//       }
//       setShowModal(false);
//       setEditTable(null);
//     } catch (error) {
//       setLoading(false);
//       message.error("Failed to add Transaction");
//     }
//   };
//   return (
//     <Layout>
//       {loading && <Spinner />}
//       <div className="filters">
//         <div>
//           <h6>Select Frequency</h6>
//           <Select value={frequency} onChange={(values) => setFrequency(values)}>
//             <Select.Option value="7">Last 1 Week</Select.Option>
//             <Select.Option value="30">Last 1 Month</Select.Option>
//             <Select.Option value="365">Last 1 Year</Select.Option>
//             <Select.Option value="custom">Custom</Select.Option>
//           </Select>
//           {frequency === "custom" && (
//             <RangePicker
//               value={selectedDate}
//               format={dateFormat}
//               onChange={(values) => setSelectedDate(values)}
//               disabledDate={(current) =>
//                 current && current > moment().endOf("day")
//               }
//             />
//           )}
//         </div>

//         <div>
//           {" "}
//           <h6>Select Type</h6>
//           <Select value={type} onChange={(values) => setType(values)}>
//             <Select.Option value="all">All</Select.Option>
//             <Select.Option value="income">Income</Select.Option>
//             <Select.Option value="expense">Expense</Select.Option>
//           </Select>
//           {frequency === "custom" && (
//             <RangePicker
//               value={selectedDate}
//               onChange={(values) => setSelectedDate(values)}
//             />
//           )}
//         </div>

//         <div className="switch-icons">
//           <UnorderedListOutlined
//             className={`mx-2 ${
//               viewData === "table" ? "active-icon" : "inactive-icon"
//             }`}
//             onClick={() => setViewData("table")}
//           />
//           <AreaChartOutlined
//             className={`mx-2 ${
//               viewData === "analytics" ? "active-icon" : "inactive-icon"
//             }`}
//             onClick={() => setViewData("analytics")}
//           />
//         </div>
//         <div>
//           <button
//             className="btn btn-primary"
//             onClick={() => setShowModal(true)}
//           >
//             Add New
//           </button>
//         </div>
//       </div>

//       <div className="content">
//         {viewData === "table" ? (
//           <Table columns={columns} dataSource={allTransaction} />
//         ) : (
//           <Analytics allTransaction={allTransaction} />
//         )}
//       </div>
//       <Modal
//         title={edittable ? "Edit Transaction" : "Add Transaction"}
//         open={showModal}
//         onCancel={() => setShowModal(false)}
//         footer={false}
//       >
//         <Form
//           layout="vertical"
//           onFinish={handleSubmit}
//           initialValues={edittable}
//         >
//           <Form.Item label="Amount" name="amount">
//             <Input type="text" />
//           </Form.Item>
//           <Form.Item label="type" name="type">
//             <Select>
//               <Select.Option value="income">Income</Select.Option>
//               <Select.Option value="expense">Expense</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item label="Transaction Category" name="category">
//             <Select>
//               {transactionType === "income" ? (
//                 <>
//                   <Select.Option value="salary">Salary</Select.Option>
//                   <Select.Option value="portfolio">
//                     Portfolio income(from investments)
//                   </Select.Option>
//                   <Select.Option value="freelancing">Freelancing</Select.Option>
//                 </>
//               ) : (
//                 <>
//                   <Select.Option value="food">Food</Select.Option>
//                   <Select.Option value="transport">Transport</Select.Option>
//                   <Select.Option value="shopping">Shopping</Select.Option>
//                   <Select.Option value="education">Education</Select.Option>
//                   <Select.Option value="entertainment">
//                     Entertainment
//                   </Select.Option>
//                   <Select.Option value="electricbill">
//                     Electricity Bill
//                   </Select.Option>
//                   <Select.Option value="waterbill">Water Bill</Select.Option>
//                   <Select.Option value="fastag">Fastage Recharge</Select.Option>
//                   <Select.Option value="mobilerecharge">
//                     Mobile Recharge
//                   </Select.Option>
//                   <Select.Option value="hospital">Hospital Bills</Select.Option>
//                   <Select.Option value="other">Other</Select.Option>
//                 </>
//               )}
//             </Select>
//           </Form.Item>
//           <Form.Item label="Date" name="date">
//             <Input type="date" />
//           </Form.Item>
//           <Form.Item label="Description" name="description">
//             <Input type="text" />
//           </Form.Item>
//           <div className="d-flex justify-content-end">
//             <button type="submit" className="btn btn-primary">
//               {" "}
//               Add Transaction
//             </button>
//           </div>
//         </Form>
//       </Modal>
//     </Layout>
//   );
// };

// export default HomePage;

// import React, { useState, useEffect } from "react";
// import { Form, Input, Select, Modal, DatePicker, message, Table } from "antd";
// import Layout from "../components/Layout/Layout";
// import axios from "axios";
// import Spinner from "../components/Spinner";
// import moment from "moment";
// import {
//   UnorderedListOutlined,
//   AreaChartOutlined,
//   EditOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";
// import Analytics from "../components/Analytics";
// const { RangePicker } = DatePicker;
// const dateFormat = "DD-MM-YYYY";

// const HomePage = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [allTransaction, setAllTransaction] = useState([]);
//   const [frequency, setFrequency] = useState("7");
//   const [selectedDate, setSelectedDate] = useState([]);
//   const [type, setType] = useState("all");
//   const [viewData, setViewData] = useState("table");
//   const [edittable, setEditTable] = useState(null);
//   const [transactionType, setTransactionType] = useState("income");

//   // table data
//   const columns = [
//     {
//       title: "Date",
//       dataIndex: "date",
//       render: (text) => <span>{moment(text).format("DD-MM-YYYY")}</span>,
//     },
//     {
//       title: "Amount",
//       dataIndex: "amount",
//     },
//     {
//       title: "Type",
//       dataIndex: "type",
//     },
//     {
//       title: "Category",
//       dataIndex: "category",
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//     },
//     {
//       title: "Action",
//       render: (text, record) => (
//         <div>
//           <EditOutlined
//             onClick={() => {
//               setEditTable(record); // Set the data you want to edit
//               setShowModal(true);
//             }}
//           />
//           <DeleteOutlined
//             className="mx-2"
//             onClick={() => {
//               handleDelete(record);
//             }}
//           />
//         </div>
//       ),
//     },
//   ];

//   // useEffect Hook
//   useEffect(() => {
//     // getAll transaction
//     const getAllTransaction = async () => {
//       try {
//         const user = JSON.parse(localStorage.getItem("user"));
//         setLoading(true);
//         const res = await axios.post("/transactions/get-transaction", {
//           userid: user._id,
//           frequency,
//           selectedDate,
//           type,
//         });
//         setLoading(false);
//         setAllTransaction(res.data);
//         console.log(res.data);
//       } catch (error) {
//         console.log(error);
//         message.error("Fetch Issue with Transaction");
//       }
//     };
//     getAllTransaction();
//   }, [frequency, selectedDate, type]);

//   // Delete handler
//   const handleDelete = async (record) => {
//     try {
//       setLoading(true);
//       await axios.post("/transactions/delete-transaction", {
//         transactionId: record._id,
//       });
//       setLoading(false);
//       message.success("Transaction Deleted!");
//     } catch (error) {
//       setLoading(false);
//       console.log(error);
//       message.error("unable to delete");
//     }
//   };

//   // Form handling
//   const handleSubmit = async (values) => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       setLoading(true);
//       if (edittable) {
//         await axios.post("/transactions/edit-transaction", {
//           payload: { ...values, userId: user._id },
//           transactionId: edittable._id,
//         });
//       } else {
//         await axios.post("/transactions/add-transaction", {
//           ...values,
//           userid: user._id,
//         });
//         setLoading(false);
//         message.success("Transaction Added Successfully");
//       }
//       setShowModal(false);
//       setEditTable(null);
//     } catch (error) {
//       setLoading(false);
//       message.error("Failed to add Transaction");
//     }
//   };

//   return (
//     <Layout>
//       {loading && <Spinner />}
//       <div className="filters">
//         <div>
//           <h6>Select Frequency</h6>
//           <Select value={frequency} onChange={(values) => setFrequency(values)}>
//             <Select.Option value="7">Last 1 Week</Select.Option>
//             <Select.Option value="30">Last 1 Month</Select.Option>
//             <Select.Option value="365">Last 1 Year</Select.Option>
//             <Select.Option value="custom">Custom</Select.Option>
//           </Select>
//           {frequency === "custom" && (
//             <RangePicker
//               value={selectedDate}
//               format={dateFormat}
//               onChange={(values) => setSelectedDate(values)}
//               disabledDate={(current) =>
//                 current && current > moment().endOf("day")
//               }
//             />
//           )}
//         </div>

//         <div>
//           <h6>Select Type</h6>
//           <Select value={type} onChange={(values) => setType(values)}>
//             <Select.Option value="all">All</Select.Option>
//             <Select.Option value="income">Income</Select.Option>
//             <Select.Option value="expense">Expense</Select.Option>
//           </Select>
//           {frequency === "custom" && (
//             <RangePicker
//               value={selectedDate}
//               format={dateFormat}
//               onChange={(values) => setSelectedDate(values)}
//             />
//           )}
//         </div>

//         <div className="switch-icons">
//           <UnorderedListOutlined
//             className={`mx-2 ${
//               viewData === "table" ? "active-icon" : "inactive-icon"
//             }`}
//             onClick={() => setViewData("table")}
//           />
//           <AreaChartOutlined
//             className={`mx-2 ${
//               viewData === "analytics" ? "active-icon" : "inactive-icon"
//             }`}
//             onClick={() => setViewData("analytics")}
//           />
//         </div>
//         <div>
//           <button
//             className="btn btn-primary"
//             onClick={() => setShowModal(true)}
//           >
//             Add New Transaction
//           </button>
//         </div>
//       </div>

//       <div className="content">
//         {viewData === "table" ? (
//           <Table columns={columns} dataSource={allTransaction} />
//         ) : (
//           <Analytics allTransaction={allTransaction} />
//         )}
//       </div>
//       <Modal
//         title={edittable ? "Edit Transaction" : "Add Transaction"}
//         open={showModal}
//         onCancel={() => setShowModal(false)}
//         footer={false}
//       >
//         <Form
//           layout="vertical"
//           onFinish={handleSubmit}
//           initialValues={edittable} // Set initial form values
//         >
//           <Form.Item label="Amount (In Rupees)" name="amount">
//             <Input type="text" />
//           </Form.Item>
//           <Form.Item label="Transaction Type(Income or Expense)" name="type">
//             <Select onChange={(value) => setTransactionType(value)}>
//               <Select.Option value="income">Income</Select.Option>
//               <Select.Option value="expense">Expense</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item label="Transaction Category" name="category">
//             <Select>
//               {transactionType === "income" ? (
//                 <>
//                   <Select.Option value="salary">Salary</Select.Option>
//                   <Select.Option value="portfolio">
//                     Portfolio income(from investments)
//                   </Select.Option>
//                   <Select.Option value="freelancing">Freelancing</Select.Option>
//                 </>
//               ) : (
//                 <>
//                   <Select.Option value="food">Food</Select.Option>
//                   <Select.Option value="transport">Transport</Select.Option>
//                   <Select.Option value="shopping">Shopping</Select.Option>
//                   <Select.Option value="education">Education</Select.Option>
//                   <Select.Option value="entertainment">
//                     Entertainment
//                   </Select.Option>
//                   <Select.Option value="electricbill">
//                     Electricity Bill
//                   </Select.Option>
//                   <Select.Option value="waterbill">Water Bill</Select.Option>
//                   <Select.Option value="fastag">Fastage Recharge</Select.Option>
//                   <Select.Option value="mobilerecharge">
//                     Mobile Recharge
//                   </Select.Option>
//                   <Select.Option value="hospital">Hospital Bills</Select.Option>
//                 </>
//               )}
//             </Select>
//           </Form.Item>
//           <Form.Item label="Date" name="date" format={dateFormat}>
//             <Input type="date" />
//           </Form.Item>
//           <Form.Item label="Description of Transaction" name="description">
//             <Input type="text" />
//           </Form.Item>

//           <div className="d-flex justify-content-end">
//             <button type="submit" className="btn btn-primary">
//               Add Transaction
//             </button>
//           </div>
//         </Form>
//       </Modal>
//     </Layout>
//   );
// };

// export default HomePage;

// import moment from "moment";
// import "../styles/LoginPage.css";
// import {
//   UnorderedListOutlined,
//   AreaChartOutlined,
//   EditOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";
// import Analytics from "../components/Analytics";
// import React, { useState, useEffect, useReducer } from "react";
// import { Form, Input, Select, Modal, DatePicker, message, Table } from "antd";
// import Layout from "../components/Layout/Layout";
// import axios from "axios";
// import Spinner from "../components/Spinner";

// // import "dayjs/locale/es";
// // import dayjs from "dayjs";

// // dayjs.locale("es");

// const disableFutureDates = (date) => {
//   return date && date > new Date();
// };
// // moment.updateLocale("en", {
// //   longDateFormat: {
// //     L: "DD-MM-YYYY", // Set your desired date format here
// //   },
// // });
// const { RangePicker } = DatePicker;

// const HomePage = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [allTransaction, setAllTransaction] = useState([]);
//   const [frequency, setFrequency] = useState("7");
//   const [selectedDate, setSelectedDate] = useState([]);
//   const [type, setType] = useState("all");
//   const [viewData, setViewData] = useState("table");
//   const [transactionType, setTransactionType] = useState("income");
//   const [edittable, setEditTable] = useState(null);
//   const handleTransactionTypeChange = (value) => {
//     setTransactionType(value);
//   };

//   const [returnValue, forceUpdate] = useReducer((x) => x + 1, 0);

//   // Sorting function to sort transactions by date in ascending order
//   const sortTransactionsByDate = (transactions) => {
//     return transactions.sort((a, b) => {
//       const dateA = moment(a.date);
//       const dateB = moment(b.date);
//       return dateB - dateA;
//     });
//   };
//   const columns = [
//     {
//       title: "Transaction Date",
//       dataIndex: "date",
//       render: (text) => (
//         <>
//           <span>{moment(text).format("DD-MM-YYYY")}</span>
//         </>
//       ),
//     },
//     {
//       title: "Transaction Amount",
//       dataIndex: "amount",
//     },

//     {
//       title: "Transaction Type",
//       dataIndex: "type",
//     },
//     {
//       title: "Transaction Category",
//       dataIndex: "category",
//     },
//     {
//       title: "Transaction Details",
//       dataIndex: "description",
//     },
//     {
//       title: " Edit | Delete",
//       render: (text, record) => (
//         <div>
//           <EditOutlined
//             onClick={() => {
//               setEditTable(record);
//               setShowModal(true);
//             }}
//           />
//           <DeleteOutlined
//             className="mx-2"
//             onClick={() => {
//               handleDelete(record);
//             }}
//           />
//         </div>
//       ),
//     },
//   ];

//   useEffect(() => {
//     //getAll transaction
//     const getAllTransaction = async () => {
//       try {
//         const user = JSON.parse(localStorage.getItem("user"));
//         setLoading(true);
//         const res = await axios.post("/transactions/get-transaction", {
//           userid: user._id,
//           frequency,
//           selectedDate,
//           type,
//         });
//         setLoading(false);
//         // setAllTransaction(res.data);
//         setAllTransaction(sortTransactionsByDate(res.data));
//         console.log(res.data);
//       } catch (error) {
//         console.log(error);
//         message.error("Fetch Issue with Transaction");
//       }
//     };
//     getAllTransaction();
//   }, [frequency, selectedDate, type, returnValue]);

//   //Delete handler
//   const handleDelete = async (record) => {
//     try {
//       setLoading(true);
//       await axios.post("/transactions/delete-transaction", {
//         transactionId: record._id,
//       });
//       setLoading(false);
//       message.success("Transaction Deleted!");
//     } catch (error) {
//       setLoading(false);
//       console.log(error);
//       message.error("unable to delete");
//     }
//     forceUpdate();
//   };

//   //Form handling
//   const handleSubmit = async (values) => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       setLoading(true);
//       if (edittable) {
//         await axios.post("/transactions/edit-transaction", {
//           payload: { ...values, userId: user._id },
//           transactionId: edittable._id,
//         });
//       } else {
//         await axios.post("/transactions/add-transaction", {
//           ...values,
//           userid: user._id,
//         });
//         setLoading(false);
//         message.success("Transaction Added Successfully");
//       }
//       setShowModal(false);
//       setEditTable(null);
//     } catch (error) {
//       setLoading(false);
//       message.error("Failed to add Transaction");
//     }
//     forceUpdate();
//   };
//   return (
//     <Layout>
//       <div className="homepage-container">
//         {loading && <Spinner />}
//         <div className="filters">
//           <div>
//             {" "}
//             <h6>Select Frequency</h6>
//             <Select
//               value={frequency}
//               onChange={(values) => setFrequency(values)}
//             >
//               <Select.Option value="7">Last 1 Week</Select.Option>
//               <Select.Option value="30">Last 1 Month</Select.Option>
//               <Select.Option value="365">Last 1 Year</Select.Option>
//               <Select.Option value="custom">Custom</Select.Option>
//             </Select>
//             {frequency === "custom" && (
//               <RangePicker
//                 value={selectedDate}
//                 format={"DD-MM-YYYY"}
//                 disabledDate={disableFutureDates}
//                 onChange={(values) => setSelectedDate(values)}
//               />
//             )}
//           </div>

//           <div>
//             {" "}
//             <h6>Select Type(Income or Expense)</h6>
//             <Select value={type} onChange={(values) => setType(values)}>
//               <Select.Option value="all">All</Select.Option>
//               <Select.Option value="income">Income</Select.Option>
//               <Select.Option value="expense">Expense</Select.Option>
//             </Select>
//           </div>

//           <div className="switch-icons">
//             <h6>Analysis</h6>
//             <UnorderedListOutlined
//               className={`mx-2 ${
//                 viewData === "table" ? "active-icon" : "inactive-icon"
//               }`}
//               onClick={() => setViewData("table")}
//             />
//             <AreaChartOutlined
//               className={`mx-2 ${
//                 viewData === "analytics" ? "active-icon" : "inactive-icon"
//               }`}
//               onClick={() => setViewData("analytics")}
//             />
//           </div>
//           <div>
//             <button
//               className="btn btn-primary btnwidth"
//               onClick={() => setShowModal(true)}
//             >
//               Add New Transaction
//             </button>
//           </div>
//         </div>

//         <div className="content">
//           {viewData === "table" ? (
//             <Table
//               columns={columns}
//               dataSource={sortTransactionsByDate(allTransaction)}
//               rowClassName={(record) =>
//                 record.type === "income" ? "green-row" : "red-row"
//               }
//             />
//           ) : (
//             <Analytics allTransaction={allTransaction} />
//           )}
//         </div>
//         <Modal
//           title={edittable ? "Edit Transaction" : "Add Transaction"}
//           open={showModal}
//           onCancel={() => setShowModal(false)}
//           footer={false}
//         >
//           <Form
//             layout="vertical"
//             onFinish={handleSubmit}
//             initialValues={edittable}
//           >
//             <Form.Item label="Amount" name="amount">
//               <Input type="text" />
//             </Form.Item>

//             <Form.Item label="Transaction Type" name="type">
//               <Select onChange={handleTransactionTypeChange}>
//                 <Select.Option value="income">Income</Select.Option>
//                 <Select.Option value="expense">Expense</Select.Option>
//               </Select>
//             </Form.Item>

//             <Form.Item label="Transaction Category" name="category">
//               <Select>
//                 {transactionType === "income" ? (
//                   <>
//                     <Select.Option value="salary">Salary</Select.Option>
//                     <Select.Option value="portfolio">
//                       Portfolio income(from investments)
//                     </Select.Option>
//                     <Select.Option value="freelancing">
//                       Freelancing
//                     </Select.Option>
//                   </>
//                 ) : (
//                   <>
//                     <Select.Option value="food">Food</Select.Option>
//                     <Select.Option value="transport">Transport</Select.Option>
//                     <Select.Option value="shopping">Shopping</Select.Option>
//                     <Select.Option value="education">Education</Select.Option>
//                     <Select.Option value="entertainment">
//                       Entertainment
//                     </Select.Option>
//                     <Select.Option value="electricbill">
//                       Electricity Bill
//                     </Select.Option>
//                     <Select.Option value="waterbill">Water Bill</Select.Option>
//                     <Select.Option value="fastag">
//                       Fastage Recharge
//                     </Select.Option>
//                     <Select.Option value="mobilerecharge">
//                       Mobile Recharge
//                     </Select.Option>
//                     <Select.Option value="hospital">
//                       Hospital Bills
//                     </Select.Option>
//                     <Select.Option value="other">Other</Select.Option>
//                   </>
//                 )}
//               </Select>
//             </Form.Item>

//             <Form.Item label="Date" name="date">
//               <DatePicker
//                 format={"DD-MM-YYYY"}
//                 disabledDate={disableFutureDates}
//                 value={moment(selectedDate)} // Set the selectedDate
//                 onChange={(date, dateString) => setSelectedDate(dateString)}
//               />
//             </Form.Item>

//             <Form.Item label="Description" name="description">
//               <Input type="text" />
//             </Form.Item>
//             <div className="d-flex justify-content-end">
//               <button type="submit" className="btn btn-primary">
//                 {" "}
//                 SAVE
//               </button>
//             </div>
//           </Form>
//         </Modal>
//       </div>
//     </Layout>
//   );
// };

// export default HomePage;

// import moment from "moment";
// import "../styles/LoginPage.css";
// import {
//   UnorderedListOutlined,
//   AreaChartOutlined,
//   EditOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";
// import Analytics from "../components/Analytics";
// import React, { useState, useEffect, useReducer } from "react";
// import { Form, Input, Select, Modal, DatePicker, message, Table } from "antd";
// import Layout from "../components/Layout/Layout";
// import axios from "axios";
// import Spinner from "../components/Spinner";

// const disableFutureDates = (date) => {
//   return date && date > new Date();
// };

// const { RangePicker } = DatePicker;

// const HomePage = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [allTransaction, setAllTransaction] = useState([]);
//   const [frequency, setFrequency] = useState("7");
//   const [selectedDate, setSelectedDate] = useState([]);
//   const [type, setType] = useState("all");
//   const [viewData, setViewData] = useState("table");
//   const [transactionType, setTransactionType] = useState("income");
//   const [edittable, setEditTable] = useState(null);

//   const handleTransactionTypeChange = (value) => {
//     setTransactionType(value);
//   };

//   const [returnValue, forceUpdate] = useReducer((x) => x + 1, 0);

//   // Sorting function to sort transactions by date in ascending order
//   const sortTransactionsByDate = (transactions) => {
//     return transactions.sort((a, b) => {
//       const dateA = moment(a.date);
//       const dateB = moment(b.date);
//       return dateB - dateA;
//     });
//   };
//   const columns = [
//     {
//       title: "Transaction Date",
//       dataIndex: "date",
//       render: (text) => (
//         <>
//           <span>{moment(text).format("DD-MM-YYYY")}</span>
//         </>
//       ),
//     },
//     {
//       title: "Transaction Amount",
//       dataIndex: "amount",
//     },

//     {
//       title: "Transaction Type",
//       dataIndex: "type",
//     },
//     {
//       title: "Transaction Category",
//       dataIndex: "category",
//     },
//     {
//       title: "Transaction Details",
//       dataIndex: "description",
//     },
//     {
//       title: " Edit | Delete",
//       render: (text, record) => (
//         <div>
//           <EditOutlined
//             onClick={() => {
//               // Set edittable to the record data
//               setEditTable(record);
//               // Open the modal
//               setShowModal(true);
//             }}
//           />
//           <DeleteOutlined
//             className="mx-2"
//             onClick={() => {
//               handleDelete(record);
//             }}
//           />
//         </div>
//       ),
//     },
//   ];

//   useEffect(() => {
//     //getAll transaction
//     const getAllTransaction = async () => {
//       try {
//         const user = JSON.parse(localStorage.getItem("user"));
//         setLoading(true);
//         const res = await axios.post("/transactions/get-transaction", {
//           userid: user._id,
//           frequency,
//           selectedDate,
//           type,
//         });
//         setLoading(false);
//         // setAllTransaction(res.data);
//         setAllTransaction(sortTransactionsByDate(res.data));
//         console.log(res.data);
//       } catch (error) {
//         console.log(error);
//         message.error("Fetch Issue with Transaction");
//       }
//     };
//     getAllTransaction();
//   }, [frequency, selectedDate, type, returnValue]);
//   // Delete handler
//   const handleDelete = async (record) => {
//     try {
//       setLoading(true);
//       await axios.post("/transactions/delete-transaction", {
//         transactionId: record._id,
//       });
//       setLoading(false);
//       message.success("Transaction Deleted!");
//     } catch (error) {
//       setLoading(false);
//       console.log(error);
//       message.error("Unable to delete");
//     }
//     forceUpdate();
//   };

//   const handleSubmit = async (values) => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       setLoading(true);
//       if (edittable) {
//         await axios.post("/transactions/edit-transaction", {
//           payload: { ...values, userId: user._id },
//           transactionId: edittable._id,
//         });
//       } else {
//         await axios.post("/transactions/add-transaction", {
//           ...values,
//           userid: user._id,
//         });
//         setLoading(false);
//         message.success("Transaction Added Successfully");
//       }
//       setShowModal(false);
//       setEditTable(null);
//     } catch (error) {
//       setLoading(false);
//       message.error("Failed to add Transaction");
//     }
//     forceUpdate();
//   };

//   return (
//     <Layout>
//       <div className="homepage-container">
//         {loading && <Spinner />}
//         <div className="filters">
//           <div>
//             {" "}
//             <h6>Select Frequency</h6>
//             <Select
//               value={frequency}
//               onChange={(values) => setFrequency(values)}
//             >
//               <Select.Option value="7">Last 1 Week</Select.Option>
//               <Select.Option value="30">Last 1 Month</Select.Option>
//               <Select.Option value="365">Last 1 Year</Select.Option>
//               <Select.Option value="custom">Custom</Select.Option>
//             </Select>
//             {frequency === "custom" && (
//               <RangePicker
//                 value={selectedDate}
//                 format={"DD-MM-YYYY"}
//                 disabledDate={disableFutureDates}
//                 onChange={(values) => setSelectedDate(values)}
//               />
//             )}
//           </div>

//           <div>
//             {" "}
//             <h6>Select Type(Income or Expense)</h6>
//             <Select value={type} onChange={(values) => setType(values)}>
//               <Select.Option value="all">All</Select.Option>
//               <Select.Option value="income">Income</Select.Option>
//               <Select.Option value="expense">Expense</Select.Option>
//             </Select>
//           </div>

//           <div className="switch-icons">
//             <h6>Analysis</h6>
//             <UnorderedListOutlined
//               className={`mx-2 ${
//                 viewData === "table" ? "active-icon" : "inactive-icon"
//               }`}
//               onClick={() => setViewData("table")}
//             />
//             <AreaChartOutlined
//               className={`mx-2 ${
//                 viewData === "analytics" ? "active-icon" : "inactive-icon"
//               }`}
//               onClick={() => setViewData("analytics")}
//             />
//           </div>
//           <div>
//             <button
//               className="btn btn-primary btnwidth"
//               onClick={() => {
//                 // Clear the edittable state
//                 setEditTable(null);
//                 // Open the modal
//                 setShowModal(true);
//               }}
//             >
//               Add New Transaction
//             </button>
//           </div>
//         </div>

//         <div className="content">
//           {viewData === "table" ? (
//             <Table
//               columns={columns}
//               dataSource={sortTransactionsByDate(allTransaction)}
//               rowClassName={(record) =>
//                 record.type === "income" ? "green-row" : "red-row"
//               }
//             />
//           ) : (
//             <Analytics allTransaction={allTransaction} />
//           )}
//         </div>
//         <Modal
//           title={edittable ? "Edit Transaction" : "Add Transaction"}
//           visible={showModal}
//           onCancel={() => setShowModal(false)}
//           footer={false}
//         >
//           <Form
//             layout="vertical"
//             onFinish={handleSubmit}
//             initialValues={
//               edittable ? { ...edittable, date: moment(edittable.date) } : {}
//             }
//           >
//             <Form.Item label="Amount" name="amount">
//               <Input type="text" />
//             </Form.Item>
//             <Form.Item label="Transaction Type" name="type">
//               <Select onChange={handleTransactionTypeChange}>
//                 <Select.Option value="income">Income</Select.Option>
//                 <Select.Option value="expense">Expense</Select.Option>
//               </Select>
//             </Form.Item>
//             <Form.Item label="Transaction Category" name="category">
//               <Select>
//                 {transactionType === "income" ? (
//                   <>
//                     <Select.Option value="salary">Salary</Select.Option>
//                     <Select.Option value="portfolio">
//                       Portfolio income(from investments)
//                     </Select.Option>
//                     <Select.Option value="freelancing">
//                       Freelancing
//                     </Select.Option>
//                   </>
//                 ) : (
//                   <>
//                     <Select.Option value="food">Food</Select.Option>
//                     <Select.Option value="transport">Transport</Select.Option>
//                     <Select.Option value="shopping">Shopping</Select.Option>
//                     <Select.Option value="education">Education</Select.Option>
//                     <Select.Option value="entertainment">
//                       Entertainment
//                     </Select.Option>
//                     <Select.Option value="electricbill">
//                       Electricity Bill
//                     </Select.Option>
//                     <Select.Option value="waterbill">Water Bill</Select.Option>
//                     <Select.Option value="fastag">
//                       Fastage Recharge
//                     </Select.Option>
//                     <Select.Option value="mobilerecharge">
//                       Mobile Recharge
//                     </Select.Option>
//                     <Select.Option value="hospital">
//                       Hospital Bills
//                     </Select.Option>
//                     <Select.Option value="other">Other</Select.Option>
//                   </>
//                 )}
//               </Select>
//             </Form.Item>
//             <Form.Item label="Date" name="date">
//               <DatePicker
//                 format={"DD-MM-YYYY"}
//                 disabledDate={disableFutureDates}
//                 value={moment(selectedDate)}
//                 onChange={(date, dateString) => setSelectedDate(dateString)}
//               />
//             </Form.Item>

//             <Form.Item label="Description" name="description">
//               <Input type="text" />
//             </Form.Item>
//             <div className="d-flex justify-content-end">
//               <button type="submit" className="btn btn-primary">
//                 SAVE
//               </button>
//             </div>
//           </Form>
//         </Modal>
//       </div>
//     </Layout>
//   );
// };

// export default HomePage;

// chatgpt code

// import moment from "moment";
// import "../styles/LoginPage.css";
// import {
//   UnorderedListOutlined,
//   AreaChartOutlined,
//   EditOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";
// import Analytics from "../components/Analytics";
// import React, { useState, useEffect, useReducer } from "react";
// import { Form, Input, Select, Modal, DatePicker, message, Table } from "antd";
// import Layout from "../components/Layout/Layout";
// import axios from "axios";
// import Spinner from "../components/Spinner";

// const disableFutureDates = (date) => {
//   return date && date > new Date();
// };

// const { RangePicker } = DatePicker;

// const HomePage = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [allTransaction, setAllTransaction] = useState([]);
//   const [frequency, setFrequency] = useState("365");
//   const [selectedDate, setSelectedDate] = useState([]);
//   const [type, setType] = useState("all");
//   const [viewData, setViewData] = useState("table");
//   const [transactionType, setTransactionType] = useState("income");
//   const [edittable, setEditTable] = useState(null);
//   // const [values, setValues] = useState({
//   //   amount: "",
//   //   type: "",
//   //   category: "",
//   //   description: "",
//   // });

//   const handleTransactionTypeChange = (value) => {
//     setTransactionType(value);
//   };

//   const [returnValue, forceUpdate] = useReducer((x) => x + 1, 0);

//   // Sorting function to sort transactions by date in ascending order
//   const sortTransactionsByDate = (transactions) => {
//     return transactions.sort((a, b) => {
//       const dateA = moment(a.date);
//       const dateB = moment(b.date);
//       return dateB - dateA;
//     });
//   };
//   const columns = [
//     {
//       title: "Transaction Date",
//       dataIndex: "date",
//       render: (text) => (
//         <>
//           <span>{moment(text).format("DD-MM-YYYY")}</span>
//         </>
//       ),
//     },
//     {
//       title: "Transaction Amount",
//       dataIndex: "amount",
//     },

//     {
//       title: "Transaction Type",
//       dataIndex: "type",
//     },
//     {
//       title: "Transaction Category",
//       dataIndex: "category",
//     },
//     {
//       title: "Transaction Details",
//       dataIndex: "description",
//     },
//     {
//       title: " Edit | Delete",
//       render: (text, record) => (
//         // <div>
//         //   <EditOutlined
//         //     onClick={() => {
//         //       // Set edittable to the record data
//         //       setEditTable(record);
//         //       // Open the modal
//         //       setShowModal(true);
//         //     }}
//         //   />
//         //   {/* <EditOutlined
//         //     onClick={() => {
//         //       // Make a copy of the record data

//         //       const edittableCopy = { ...record };

//         //       // Set edittable to the copy of the record data
//         //       setEditTable(edittableCopy);

//         //       // Open the modal
//         //       setShowModal(true);

//         //       // Set the form field values to the copy of the record data
//         //       setValues(edittableCopy);
//         //     }}
//         //   /> */}
//         //   <DeleteOutlined
//         //     className="mx-2"
//         //     onClick={() => {
//         //       handleDelete(record);
//         //     }}
//         //   />
//         // </div>
//         <div>
//           <EditOutlined
//             onClick={() => {
//               setEditTable(record);
//               setShowModal(true);
//             }}
//           />
//           <DeleteOutlined
//             className="mx-2"
//             onClick={() => {
//               handleDelete(record);
//             }}
//           />
//         </div>
//       ),
//     },
//   ];

//   useEffect(() => {
//     //getAll transaction
//     const getAllTransaction = async () => {
//       try {
//         const user = JSON.parse(localStorage.getItem("user"));
//         setLoading(true);
//         const res = await axios.post("/transactions/get-transaction", {
//           userid: user._id,
//           frequency,
//           selectedDate,
//           type,
//         });
//         setLoading(false);
//         // setAllTransaction(res.data);
//         setAllTransaction(sortTransactionsByDate(res.data));
//         console.log(res.data);
//       } catch (error) {
//         console.log(error);
//         message.error("Fetch Issue with Transaction");
//       }
//     };
//     getAllTransaction();
//   }, [frequency, selectedDate, type, returnValue]);
//   // Delete handler
//   const handleDelete = async (record) => {
//     try {
//       setLoading(true);
//       await axios.post("/transactions/delete-transaction", {
//         transactionId: record._id,
//       });
//       setLoading(false);
//       message.success("Transaction Deleted!");
//     } catch (error) {
//       setLoading(false);
//       console.log(error);
//       message.error("Unable to delete");
//     }
//     forceUpdate();
//   };

//   // const handleSubmit = async (values) => {
//   //   try {
//   //     const user = JSON.parse(localStorage.getItem("user"));
//   //     setLoading(true);

//   //     if (edittable) {
//   //       // If you are editing a transaction, make a request to edit the transaction
//   //       await axios.post("/transactions/edit-transaction", {
//   //         payload: { ...values, userId: user._id },
//   //         transactionId: edittable._id,
//   //       });
//   //     } else {
//   //       // If you are adding a new transaction, make a request to add the transaction
//   //       await axios.post("/transactions/add-transaction", {
//   //         ...values,
//   //         userid: user._id,
//   //       });
//   //       setShowModal(false);
//   //       forceUpdate();
//   //       setEditTable(null);
//   //       // window.location.reload();
//   //     }

//   //     setLoading(false);
//   //     message.success(
//   //       edittable
//   //         ? "Transaction Updated Successfully"
//   //         : "Transaction Added Successfully"
//   //     );
//   //     setShowModal(false);
//   //     setEditTable(null);
//   //     window.location.reload();
//   //   } catch (error) {
//   //     setLoading(false);
//   //     message.error(
//   //       edittable ? "Failed to update Transaction" : "Failed to add Transaction"
//   //     );
//   //   }
//   //   forceUpdate();
//   // };
//   const handleSubmit = async (values) => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       setLoading(true);

//       if (edittable) {
//         // If you are editing a transaction, make a request to edit the transaction
//         await axios.post("/transactions/edit-transaction", {
//           payload: { ...values, userId: user._id },
//           transactionId: edittable._id,
//         });

//         // After the edit is successful, update the state
//         const updatedTransaction = { ...edittable, ...values }; // Assuming the response from the server includes the updated transaction
//         const updatedTransactionList = allTransaction.map((transaction) => {
//           if (transaction._id === edittable._id) {
//             return updatedTransaction;
//           }
//           return transaction;
//         });

//         setAllTransaction(sortTransactionsByDate(updatedTransactionList));
//       } else {
//         // If you are adding a new transaction, make a request to add the transaction
//         await axios.post("/transactions/add-transaction", {
//           ...values,
//           userid: user._id,
//         });
//       }

//       setLoading(false);
//       message.success(
//         edittable
//           ? "Transaction Updated Successfully"
//           : "Transaction Added Successfully"
//       );
//       // window.location.reload();
//       setShowModal(false);
//       setEditTable(null);

//       // No need to use window.location.reload() here
//     } catch (error) {
//       setLoading(false);
//       message.error(
//         edittable ? "Failed to update Transaction" : "Failed to add Transaction"
//       );
//     }
//     forceUpdate(); // Make sure to force a component rerender in both cases
//   };

//   return (
//     <Layout>
//       <div className="homepage-container">
//         {loading && <Spinner />}
//         <div className="filters">
//           <div>
//             {" "}
//             <h6>Select Frequency</h6>
//             <Select
//               value={frequency}
//               onChange={(values) => setFrequency(values)}
//             >
//               <Select.Option value="7">Last 1 Week</Select.Option>
//               <Select.Option value="30">Last 1 Month</Select.Option>
//               <Select.Option value="365">Last 1 Year</Select.Option>
//               <Select.Option value="custom">Custom</Select.Option>
//             </Select>
//             {frequency === "custom" && (
//               <RangePicker
//                 value={selectedDate}
//                 format={"DD-MM-YYYY"}
//                 disabledDate={disableFutureDates}
//                 onChange={(values) => setSelectedDate(values)}
//               />
//             )}
//           </div>

//           <div>
//             {" "}
//             <h6>Select Type(Income or Expense)</h6>
//             <Select value={type} onChange={(values) => setType(values)}>
//               <Select.Option value="all">All</Select.Option>
//               <Select.Option value="income">Income</Select.Option>
//               <Select.Option value="expense">Expense</Select.Option>
//             </Select>
//           </div>

//           <div className="switch-icons">
//             <h6>Analysis</h6>
//             <UnorderedListOutlined
//               className={`mx-2 ${
//                 viewData === "table" ? "active-icon" : "inactive-icon"
//               }`}
//               onClick={() => setViewData("table")}
//             />
//             <AreaChartOutlined
//               className={`mx-2 ${
//                 viewData === "analytics" ? "active-icon" : "inactive-icon"
//               }`}
//               onClick={() => setViewData("analytics")}
//             />
//           </div>
//           <div>
//             <button
//               className="btn btn-primary btnwidth"
//               onClick={() => {
//                 // Clear the edittable state
//                 setEditTable(null);
//                 // Open the modal
//                 setShowModal(true);
//               }}
//             >
//               Add New Transaction
//             </button>
//           </div>
//         </div>

//         <div className="content">
//           {viewData === "table" ? (
//             <Table
//               columns={columns}
//               dataSource={sortTransactionsByDate(allTransaction)}
//               rowClassName={(record) =>
//                 record.type === "income" ? "green-row" : "red-row"
//               }
//             />
//           ) : (
//             <Analytics allTransaction={allTransaction} />
//           )}
//         </div>
//         <Modal
//           title={edittable ? "Edit Transaction" : "Add Transaction"}
//           open={showModal}
//           onCancel={() => setShowModal(false)}
//           footer={false}
//         >
//           <Form
//             layout="vertical"
//             onFinish={handleSubmit}
//             initialValues={
//               edittable
//                 ? { ...edittable, date: moment(edittable.date, "DD-MM-YYYY") }
//                 : {}
//             }
//           >
//             <Form.Item label="Amount" name="amount">
//               <Input type="text" />
//             </Form.Item>
//             <Form.Item label="Transaction Type" name="type">
//               <Select onChange={handleTransactionTypeChange}>
//                 <Select.Option value="income">Income</Select.Option>
//                 <Select.Option value="expense">Expense</Select.Option>
//               </Select>
//             </Form.Item>
//             <Form.Item label="Transaction Category" name="category">
//               <Select>
//                 {transactionType === "income" ? (
//                   <>
//                     <Select.Option value="salary">Salary</Select.Option>
//                     <Select.Option value="portfolio">
//                       Portfolio income(from investments)
//                     </Select.Option>
//                     <Select.Option value="freelancing">
//                       Freelancing
//                     </Select.Option>
//                   </>
//                 ) : (
//                   <>
//                     <Select.Option value="food">Food</Select.Option>
//                     <Select.Option value="transport">Transport</Select.Option>
//                     <Select.Option value="shopping">Shopping</Select.Option>
//                     <Select.Option value="education">Education</Select.Option>
//                     <Select.Option value="entertainment">
//                       Entertainment
//                     </Select.Option>
//                     <Select.Option value="electricbill">
//                       Electricity Bill
//                     </Select.Option>
//                     <Select.Option value="waterbill">Water Bill</Select.Option>
//                     <Select.Option value="fastag">
//                       Fastage Recharge
//                     </Select.Option>
//                     <Select.Option value="mobilerecharge">
//                       Mobile Recharge
//                     </Select.Option>
//                     <Select.Option value="hospital">
//                       Hospital Bills
//                     </Select.Option>
//                     <Select.Option value="other">Other</Select.Option>
//                   </>
//                 )}
//               </Select>
//             </Form.Item>
//             <Form.Item label="Date" name="date">
//               <DatePicker
//                 format={"DD-MM-YYYY"}
//                 disabledDate={disableFutureDates}
//                 value={edittable ? moment(edittable.date, "DD-MM-YYYY") : null}
//                 onChange={(date, dateString) => setSelectedDate(dateString)}
//               />
//             </Form.Item>

//             <Form.Item label="Description" name="description">
//               <Input type="text" />
//             </Form.Item>
//             <div className="d-flex justify-content-end">
//               <button type="submit" className="btn btn-primary">
//                 SAVE
//               </button>
//             </div>
//           </Form>
//         </Modal>
//       </div>
//     </Layout>
//   );
// };

// export default HomePage;

import moment from "moment";
import "../styles/LoginPage.css";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Analytics from "../components/Analytics";
import React, { useState, useEffect, useReducer } from "react";
import { Form, Input, Select, Modal, DatePicker, message, Table } from "antd";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import Spinner from "../components/Spinner";

const disableFutureDates = (date) => {
  return date && date > new Date();
};

const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState("365");
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [transactionType, setTransactionType] = useState("income");
  const [edittable, setEditTable] = useState(null);
  // const [values, setValues] = useState({
  //   amount: "",
  //   type: "",
  //   category: "",
  //   description: "",
  // });

  const handleTransactionTypeChange = (value) => {
    setTransactionType(value);
  };

  const [returnValue, forceUpdate] = useReducer((x) => x + 1, 0);

  // Sorting function to sort transactions by date in ascending order
  const sortTransactionsByDate = (transactions) => {
    return transactions.sort((a, b) => {
      const dateA = moment(a.date);
      const dateB = moment(b.date);
      return dateB - dateA;
    });
  };
  const columns = [
    {
      title: "Transaction Date",
      dataIndex: "date",
      render: (text) => (
        <>
          <span>{moment(text).format("DD-MM-YYYY")}</span>
        </>
      ),
    },
    {
      title: "Transaction Amount",
      dataIndex: "amount",
    },

    {
      title: "Transaction Type",
      dataIndex: "type",
    },
    {
      title: "Transaction Category",
      dataIndex: "category",
    },
    {
      title: "Transaction Details",
      dataIndex: "description",
    },
    {
      title: " Edit | Delete",
      render: (text, record) => (
        // <div>
        //   <EditOutlined
        //     onClick={() => {
        //       // Set edittable to the record data
        //       setEditTable(record);
        //       // Open the modal
        //       setShowModal(true);
        //     }}
        //   />
        //   {/* <EditOutlined
        //     onClick={() => {
        //       // Make a copy of the record data

        //       const edittableCopy = { ...record };

        //       // Set edittable to the copy of the record data
        //       setEditTable(edittableCopy);

        //       // Open the modal
        //       setShowModal(true);

        //       // Set the form field values to the copy of the record data
        //       setValues(edittableCopy);
        //     }}
        //   /> */}
        //   <DeleteOutlined
        //     className="mx-2"
        //     onClick={() => {
        //       handleDelete(record);
        //     }}
        //   />
        // </div>
        <div>
          <EditOutlined
            onClick={() => {
              setEditTable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined
            className="mx-2"
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    //getAll transaction
    const getAllTransaction = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        const res = await axios.post("/transactions/get-transaction", {
          userid: user._id,
          frequency,
          selectedDate,
          type,
        });
        setLoading(false);
        // setAllTransaction(res.data);
        setAllTransaction(sortTransactionsByDate(res.data));
        console.log(res.data);
      } catch (error) {
        console.log(error);
        message.error("Fetch Issue with Transaction");
      }
    };
    getAllTransaction();
  }, [frequency, selectedDate, type, returnValue]);
  // Delete handler
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post("/transactions/delete-transaction", {
        transactionId: record._id,
      });
      setLoading(false);
      message.success("Transaction Deleted!");
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("Unable to delete");
    }
    forceUpdate();
  };

  // const handleSubmit = async (values) => {
  //   try {
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     setLoading(true);

  //     if (edittable) {
  //       // If you are editing a transaction, make a request to edit the transaction
  //       await axios.post("/transactions/edit-transaction", {
  //         payload: { ...values, userId: user._id },
  //         transactionId: edittable._id,
  //       });
  //     } else {
  //       // If you are adding a new transaction, make a request to add the transaction
  //       await axios.post("/transactions/add-transaction", {
  //         ...values,
  //         userid: user._id,
  //       });
  //       setShowModal(false);
  //       forceUpdate();
  //       setEditTable(null);
  //       // window.location.reload();
  //     }

  //     setLoading(false);
  //     message.success(
  //       edittable
  //         ? "Transaction Updated Successfully"
  //         : "Transaction Added Successfully"
  //     );
  //     setShowModal(false);
  //     setEditTable(null);
  //     window.location.reload();
  //   } catch (error) {
  //     setLoading(false);
  //     message.error(
  //       edittable ? "Failed to update Transaction" : "Failed to add Transaction"
  //     );
  //   }
  //   forceUpdate();
  // };
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);

      if (edittable) {
        // If you are editing a transaction, make a request to edit the transaction
        await axios.post("/transactions/edit-transaction", {
          payload: { ...values, userId: user._id },
          transactionId: edittable._id,
        });

        // After the edit is successful, update the state
        const updatedTransaction = { ...edittable, ...values }; // Assuming the response from the server includes the updated transaction
        const updatedTransactionList = allTransaction.map((transaction) => {
          if (transaction._id === edittable._id) {
            return updatedTransaction;
          }
          return transaction;
        });

        setAllTransaction(sortTransactionsByDate(updatedTransactionList));
      } else {
        // If you are adding a new transaction, make a request to add the transaction
        await axios.post("/transactions/add-transaction", {
          ...values,
          userid: user._id,
        });

        // After adding a new transaction, you need to add it to the state
        // Instead of just setting it, concatenate the new transaction to the existing array
        setAllTransaction((prevTransactions) =>
          sortTransactionsByDate([...prevTransactions, values])
        );
      }

      setLoading(false);
      message.success(
        edittable
          ? "Transaction Updated Successfully"
          : "Transaction Added Successfully"
      );
      setShowModal(false);
      setEditTable(null);
    } catch (error) {
      setLoading(false);
      message.error(
        edittable ? "Failed to update Transaction" : "Failed to add Transaction"
      );
    }
    forceUpdate(); // Make sure to force a component rerender in both cases
  };

  return (
    <Layout>
      <div className="homepage-container">
        {loading && <Spinner />}
        <div className="filters">
          <div>
            {" "}
            <h6>Select Frequency</h6>
            <Select
              value={frequency}
              onChange={(values) => setFrequency(values)}
            >
              <Select.Option value="7">Last 1 Week</Select.Option>
              <Select.Option value="30">Last 1 Month</Select.Option>
              <Select.Option value="365">Last 1 Year</Select.Option>
              <Select.Option value="custom">Custom</Select.Option>
            </Select>
            {frequency === "custom" && (
              <RangePicker
                value={selectedDate}
                format={"DD-MM-YYYY"}
                disabledDate={disableFutureDates}
                onChange={(values) => setSelectedDate(values)}
              />
            )}
          </div>

          <div>
            {" "}
            <h6>Select Type(Income or Expense)</h6>
            <Select value={type} onChange={(values) => setType(values)}>
              <Select.Option value="all">All</Select.Option>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </div>

          <div className="switch-icons">
            <h6>Analysis</h6>
            <UnorderedListOutlined
              className={`mx-2 ${
                viewData === "table" ? "active-icon" : "inactive-icon"
              }`}
              onClick={() => setViewData("table")}
            />
            <AreaChartOutlined
              className={`mx-2 ${
                viewData === "analytics" ? "active-icon" : "inactive-icon"
              }`}
              onClick={() => setViewData("analytics")}
            />
          </div>
          <div>
            <button
              className="btn btn-primary btnwidth"
              onClick={() => {
                // Clear the edittable state
                setEditTable(null);
                // Open the modal
                setShowModal(true);
              }}
            >
              Add New Transaction
            </button>
          </div>
        </div>

        <div className="content">
          {viewData === "table" ? (
            <Table
              columns={columns}
              dataSource={sortTransactionsByDate(allTransaction)}
              rowClassName={(record) =>
                record.type === "income" ? "green-row" : "red-row"
              }
            />
          ) : (
            <Analytics allTransaction={allTransaction} />
          )}
        </div>
        <Modal
          title={edittable ? "Edit Transaction" : "Add Transaction"}
          open={showModal}
          onCancel={() => setShowModal(false)}
          footer={false}
        >
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={
              edittable
                ? { ...edittable, date: moment(edittable.date, "DD-MM-YYYY") }
                : {}
            }
          >
            <Form.Item label="Amount" name="amount">
              <Input type="text" />
            </Form.Item>
            <Form.Item label="Transaction Type" name="type">
              <Select onChange={handleTransactionTypeChange}>
                <Select.Option value="income">Income</Select.Option>
                <Select.Option value="expense">Expense</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Transaction Category" name="category">
              <Select>
                {transactionType === "income" ? (
                  <>
                    <Select.Option value="salary">Salary</Select.Option>
                    <Select.Option value="portfolio">
                      Portfolio income(from investments)
                    </Select.Option>
                    <Select.Option value="freelancing">
                      Freelancing
                    </Select.Option>
                  </>
                ) : (
                  <>
                    <Select.Option value="food">Food</Select.Option>
                    <Select.Option value="transport">Transport</Select.Option>
                    <Select.Option value="shopping">Shopping</Select.Option>
                    <Select.Option value="education">Education</Select.Option>
                    <Select.Option value="entertainment">
                      Entertainment
                    </Select.Option>
                    <Select.Option value="electricbill">
                      Electricity Bill
                    </Select.Option>
                    <Select.Option value="waterbill">Water Bill</Select.Option>
                    <Select.Option value="fastag">
                      Fastage Recharge
                    </Select.Option>
                    <Select.Option value="mobilerecharge">
                      Mobile Recharge
                    </Select.Option>
                    <Select.Option value="hospital">
                      Hospital Bills
                    </Select.Option>
                    <Select.Option value="other">Other</Select.Option>
                  </>
                )}
              </Select>
            </Form.Item>
            {/* <Form.Item label="Date" name="date">
              <DatePicker
                format={"DD-MM-YYYY"}
                disabledDate={disableFutureDates}
                value={edittable ? moment(edittable.date, "DD-MM-YYYY") : null}
                onChange={(date, dateString) => setSelectedDate(dateString)}
              />
            </Form.Item> */}

            <Form.Item label="Date" name="date">
              <Input type="date" />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <Input type="text" />
            </Form.Item>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary">
                SAVE
              </button>
            </div>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default HomePage;
