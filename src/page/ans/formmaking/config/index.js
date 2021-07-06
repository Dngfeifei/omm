
export const pagination = (total) => ({
    total,
    pageSize: 10,
    size: "small",
    hideOnSinglePage: false,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "50", "100"],
    showQuickJumper: true,
    showTotal: () => `共${total}条`,
  });