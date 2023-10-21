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
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [transactionType, setTransactionType] = useState("income");
  const [edittable, setEditTable] = useState(null);
  const [form] = Form.useForm(); // Create a form instance

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

  useEffect(() => {
    // getAll transaction
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

  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if (edittable) {
        await axios.post("/transactions/edit-transaction", {
          payload: { ...values, userId: user._id },
          transactionId: edittable._id,
        });
      } else {
        await axios.post("/transactions/add-transaction", {
          ...values,
          userid: user._id,
        });
        message.success("Transaction Added Successfully");
      }
      setLoading(false);
      setShowModal(false);
      setEditTable(null);
      form.resetFields(); // Reset the form
    } catch (error) {
      setLoading(false);
      message.error("Failed to add Transaction");
    }
    forceUpdate();
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
                form.resetFields(); // Reset the form
                setEditTable(null);
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
          visible={showModal}
          onCancel={() => {
            form.resetFields(); // Reset the form
            setShowModal(false);
          }}
          footer={false}
        >
          <Form
            form={form} // Set the form instance
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={
              edittable ? { ...edittable, date: moment(edittable.date) } : {}
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
           
              <Form.Item label="Transaction Category" name="category">
              <Select>
                {transactionType === "income" ? (
                  <>
                    <Select.Option value="salary">Salary</Select.Option>
                    <Select.Option value="portfolio">
                      Portfolio income (from investments)
                    </Select.Option>
                    <Select.Option value="freelancing">Freelancing</Select.Option>
                  </>
                ) : (
                  <>
                    <Select.Option value="food">Food</Select.Option>
                    <Select.Option value="transport">Transport</Select.Option>
                    <Select.Option value="shopping">Shopping</Select.Option>
                    <Select.Option value="education">Education</Select.Option>
                    <Select.Option value="entertainment">Entertainment</Select.Option>
                    <Select.Option value="electricbill">Electricity Bill</Select.Option>
                    <Select.Option value="waterbill">Water Bill</Select.Option>
                    <Select.Option value="fastag">Fastag Recharge</Select.Option>
                    <Select.Option value="mobilerecharge">Mobile Recharge</Select.Option>
                    <Select.Option value="hospital">Hospital Bills</Select.Option>
                    <Select.Option value="other">Other</Select.Option>
                  </>
                )}
              </Select>
            </Form.Item>
            <Form.Item label="Date" name="date">
              <DatePicker
                format={"DD-MM-YYYY"}
                disabledDate={disableFutureDates}
              />
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
