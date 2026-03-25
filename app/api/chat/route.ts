import { deepseek } from '@ai-sdk/deepseek';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  console.log(messages,'messages');
    try{
        // 故意添加一个错误来测试错误处理
        if (messages[0]?.content === 'test error') {
            throw new Error('测试错误信息：这是一个故意触发的错误');
        }
        const result = await streamText({
            model: deepseek('deepseek-chat'),
            messages: await convertToModelMessages(messages),
          })
        console.log(result,'result');
        
          return result.toUIMessageStreamResponse({
            sendReasoning: true,
          });
    }catch(error:any){
        console.log('捕获到错误:', error);
        console.log('错误类型:', typeof error);
        console.log('错误堆栈:', error.stack);
        if (error.status === 402 || error.message?.includes('Insufficient Balance')) {
            return new Response(
                JSON.stringify({ error: 'DeepSeek 账户余额不足，请先前往官网充值。' }),
                { status: 402, headers: { 'Content-Type': 'application/json' } }
            );
        }
        // 返回具体的错误信息给前端
        return new Response(
            JSON.stringify({ error: error.message || '服务器错误' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
  };

  
}



// export async function POST(req: Request) {
//     try {
//       const { messages } = await req.json();
//       const result = await streamText({
//         model: deepseek('deepseek-chat'),
//         messages,
//       });
//       return result.toDataStreamResponse();
//     } catch (error: any) {
//       // 捕获余额不足或其他 API 错误
//       if (error.status === 402 || error.message?.includes('Insufficient Balance')) {
//         return new Response(
//           JSON.stringify({ error: 'DeepSeek 账户余额不足，请先前往官网充值。' }),
//           { status: 402, headers: { 'Content-Type': 'application/json' } }
//         );
//       }
//       return new Response('服务器错误', { status: 500 });
//     }
//   }