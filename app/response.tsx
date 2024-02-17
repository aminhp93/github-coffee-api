"use client";

export default function Response({ data }: any) {
  return (
    <>
      {data ? (
        <>
          <div>Response</div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
      ) : (
        "No response"
      )}
    </>
  );
}
