const fs = require('fs');

function CreateUnityRequestFile(mapRouter) {
	let data = `
	using System;
	`;

	Object.keys(mapRouter).forEach(main_cate => {
		Object.keys(mapRouter[main_cate]).forEach(api_name => {
			const requestData = mapRouter[main_cate][api_name].REQUEST_DATA;
			const cate = main_cate === 'root' ? '' : main_cate + '_';
			data += `
					[Serializable]
					public class ${cate}${api_name}_Request
					{\n`;
			data += `    public string type;\t// default value : db\n`;
			Object.keys(requestData).forEach(key => {
				data += `    public ${requestData[key].type === 'number' ? 'int' : 'string'} ${key};\t//${requestData[key].desc};\n`;
			});
			data += `}`;
		});
	});

	fs.writeFileSync('HTTPRequestModels.cs', data);
}

function CreateUnityHTTPRequestMgrFile(mapRouter) {
	let data = `
	using System.Collections.Generic;
	using UnityEngine;

	public static class HTTPRequestManager
	{
	`;

	Object.keys(mapRouter).forEach(main_cate => {
		Object.keys(mapRouter[main_cate]).forEach(api_name => {
			const requestData = mapRouter[main_cate][api_name].REQUEST_DATA;
			const cate = main_cate === 'root' ? '' : main_cate + '_';
			data += `          
					public static Coroutine ${cate}${api_name}(${Object.keys(requestData).map(key => `${requestData[key].type === 'number' ? 'int' : 'string'} ${key}`).join(', ')})
					{\n`;
			data += `    var requestBody = new ${cate}${api_name}_Request\n    {\n`;
			data += `        type = "db",\n`;
			Object.keys(requestData).forEach(key => {
				data += `        ${key} = ${key},\n`;
			});
			data += `    };\n`;
			data += `    return HTTPManager.Instance.PostJson<${cate}${api_name}_Request, Dictionary<string, object>>("${main_cate}/${api_name}", requestBody, null, null);\n`;
			data += `}\n`;
		});
	});
	data += `  }\n`;

	fs.writeFileSync('HTTPRequestManager.cs', data);
}

module.exports = {
	CreateUnityRequestFile,
	CreateUnityHTTPRequestMgrFile
};
