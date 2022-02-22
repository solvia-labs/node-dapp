function readUInt64LE(buffer, offset) {
    const a = buffer.readUInt32LE(offset);
    let b = buffer.readUInt32LE(offset + 4);
    b *= 0x100000000;
    //verifuint(b + a, 0x001fffffffffffff);
    return b + a;
}
export class BufferReader {
    constructor(buffer, offset = 0) {
        this.buffer = buffer;
        this.offset = offset;
        //typeforce(types.tuple(types.Buffer, types.UInt32), [buffer, offset]);
    }
    readUInt64() {
        const a = this.buffer.readUInt32LE(this.offset);
        let b = this.buffer.readUInt32LE(this.offset + 4);
        b *= 0x100000000;
        const result = a+b;
        this.offset += 8;
        return result;
    }
    readInt8() {
        const result = this.buffer.readInt8(this.offset);
        this.offset += 1;
        return result;
    }
    readInt16() {
        const result = this.buffer.readInt16LE(this.offset);
        this.offset += 2;
        return result;
    }
    readInt32() {
        const result = this.buffer.readInt32LE(this.offset);
        this.offset += 4;
        return result;
    }
    readSlice(n) {
        if (this.buffer.length < this.offset + n) {
            throw new Error('Cannot read slice out of bounds');
        }
        const result = this.buffer.slice(this.offset, this.offset + n);
        this.offset += n;
        return result;
    }
    readVarSlice() {
        return this.readSlice(this.readVarInt());
    }
    readVector() {
        const count = this.readVarInt();
        const vector = [];
        for (let i = 0; i < count; i++) vector.push(this.readVarSlice());
        return vector;
    }
    readleftbuffer(){
        return this.readSlice(this.buffer.length - this.offset);
    }
}