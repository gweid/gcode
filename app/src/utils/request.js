import md5 from 'md5';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { signKey } from '../../../config/config.default';

const request = ({
  url,
  method = 'post',
  data = {},
  headers = {},
  query = {},
  responseType = 'json',
  timeout = 60000,
  errorMessage = '网络异常',
}) => {
  const st = Date.now();

  const reqHeader = {
    ...headers,
    s_t: st,
    s_sign: md5(`${signKey}_${st}`),
  };

  const reqParams = {
    url,
    method,
    data,
    headers: reqHeader,
    params: query,
    responseType,
    timeout,
    errorMessage,
  };

  return axios
    .request(reqParams)
    .then((res) => {
      const resData = res.data || {};

      const { success } = resData;

      if (!success) {
        const { code, message } = resData;

        switch (code) {
          case 442:
            ElMessage.error('请求参数异常');
            break;
          case 445:
            ElMessage.error('请求不合法');
            break;
          case 446:
            ElMessage.error('缺少项目必要参数');
            break;
          case 50000:
            ElMessage.error(message);
            break;
          default:
            ElMessage.error(errorMessage);
            break;
        }

        console.error(message);

        return Promise.resolve({
          success,
          code,
          message,
        });
      }

      const { data, metadata } = resData;
      return Promise.resolve({
        success,
        data,
        metadata,
      });
    })
    .catch((error) => {
      const { message } = error;

      if (message.match(/timeout/)) {
        return Promise.resolve({
          message: 'Request Timeout',
          code: 504,
        });
      }

      return Promise.resolve(error);
    });
};

export default request;
